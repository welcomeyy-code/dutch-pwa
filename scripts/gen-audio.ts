// 用 Azure Speech 的荷兰语神经语音，为词库、例句、听力材料预生成 mp3。
// 女声：nl-NL-ColetteNeural（清单键 = 文本）；男声：nl-NL-MaartenNeural（清单键 = "m|" + 文本）。
// 用法（PowerShell）：
//   $env:AZURE_SPEECH_KEY="你的key"; $env:AZURE_SPEECH_REGION="swedencentral"; node scripts/gen-audio.ts
// 可重复运行：已生成的文件会跳过；中断后再运行即可继续。
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import core from '../src/data/core.json' with { type: 'json' }
import { SEED_WORDS } from '../src/data/a1-words.ts'
import { PHONEMES } from '../src/data/phonemes.ts'
import { LESSONS, exerciseSentence } from '../src/data/grammar.ts'
import { LISTENING } from '../src/data/listening.ts'

const KEY = process.env.AZURE_SPEECH_KEY
const REGION = process.env.AZURE_SPEECH_REGION
const VOICE_F = process.env.AZURE_VOICE ?? 'nl-NL-ColetteNeural' // 备选：nl-NL-FennaNeural（同为女声）
const VOICE_M = process.env.AZURE_VOICE_M ?? 'nl-NL-MaartenNeural'
const RATE = process.env.AZURE_RATE ?? '-8%' // 学习者用，略慢
const FORMAT = 'audio-24khz-48kbitrate-mono-mp3'
const OUT = join(import.meta.dirname, '..', 'public', 'audio')

if (!KEY || !REGION) {
  console.error('请先设置环境变量 AZURE_SPEECH_KEY 和 AZURE_SPEECH_REGION')
  process.exit(1)
}

interface Job { key: string; text: string; voice: string }
const jobs = new Map<string, Job>()
const female = (text: string) => { jobs.set(text, { key: text, text, voice: VOICE_F }) }
const male = (text: string) => { jobs.set(`m|${text}`, { key: `m|${text}`, text, voice: VOICE_M }) }

// 必须与应用里朗读的文本完全一致（见 src/components/wordUtil.ts 的 displayWord）
const display = (w: { nl: string; article?: string | null }) => (w.article ? `${w.article} ${w.nl}` : w.nl)

for (const w of core.words) female(display(w))
for (const w of SEED_WORDS) {
  female(display(w))
  for (const e of w.examples) female(e.nl)
}
for (const l of LESSONS) {
  for (const e of l.examples) female(e.nl)
  for (const x of l.exercises) { const s = exerciseSentence(x); if (s) female(s) }
}
for (const p of PHONEMES) {
  for (const m of p.minimalPairs) female(m.nl)
  for (const m of p.examples) female(m.nl)
}
for (const p of LISTENING) for (const l of p.lines) (l.who === 'm' ? male : female)(l.nl)
female('Goedemorgen! Ik leer Nederlands.')

const list = [...jobs.values()].sort((a, b) => a.key.localeCompare(b.key))
mkdirSync(OUT, { recursive: true })

// 文件名 = 声音 + 文本的哈希，新增文本不会让旧文件错配
const fileOf = (j: Job) => createHash('sha1').update(`${j.voice}|${j.text}`).digest('hex').slice(0, 12) + '.mp3'

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

async function synth(j: Job): Promise<Buffer> {
  const ssml =
    `<speak version="1.0" xml:lang="nl-NL" xmlns="http://www.w3.org/2001/10/synthesis">` +
    `<voice name="${j.voice}"><prosody rate="${RATE}">${esc(j.text)}</prosody></voice></speak>`
  for (let attempt = 0; attempt < 6; attempt++) {
    const res = await fetch(`https://${REGION}.tts.speech.microsoft.com/cognitiveservices/v1`, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': KEY!,
        'Content-Type': 'application/ssml+xml',
        'X-Microsoft-OutputFormat': FORMAT,
        'User-Agent': 'dutch-pwa-audio-gen',
      },
      body: ssml,
    })
    if (res.ok) return Buffer.from(await res.arrayBuffer())
    if (res.status === 429 || res.status >= 500) {
      console.log(`  限速或服务忙（${res.status}），等待后重试…`)
      await sleep(15000)
      continue
    }
    throw new Error(`Azure ${res.status}: ${(await res.text()).slice(0, 200)}`)
  }
  throw new Error('多次重试仍失败')
}

function writeManifest() {
  const have = new Set(readdirSync(OUT))
  const manifest: Record<string, string> = {}
  for (const j of list) if (have.has(fileOf(j))) manifest[j.key] = fileOf(j)
  writeFileSync(join(OUT, 'index.json'), JSON.stringify(manifest))
  return Object.keys(manifest).length
}

const todo = list.filter((j) => !existsSync(join(OUT, fileOf(j))))
console.log(`共 ${list.length} 条，已有 ${list.length - todo.length}，待生成 ${todo.length}。女声：${VOICE_F}，男声：${VOICE_M}`)

// 免费档约每分钟 20 次请求，保守按 ~18 次/分钟
const GAP = 3400
let n = 0
for (const j of todo) {
  const started = Date.now()
  try {
    writeFileSync(join(OUT, fileOf(j)), await synth(j))
  } catch (e) {
    console.error(`失败：${j.text} — ${e instanceof Error ? e.message : e}`)
    writeManifest()
    process.exit(1)
  }
  n++
  if (n % 25 === 0) console.log(`  已生成 ${n}/${todo.length}`)
  if (n % 50 === 0) writeManifest()
  const wait = GAP - (Date.now() - started)
  if (wait > 0) await sleep(wait)
}
console.log(`完成。清单共 ${writeManifest()} 条。`)
