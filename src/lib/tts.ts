import { settings } from './settings'

let voices: SpeechSynthesisVoice[] = []

function load() {
  if (!('speechSynthesis' in window)) return
  voices = window.speechSynthesis.getVoices()
}
if ('speechSynthesis' in window) {
  load()
  window.speechSynthesis.addEventListener?.('voiceschanged', load)
}

const isDutch = (v: SpeechSynthesisVoice) => v.lang.replace('_', '-').toLowerCase().startsWith('nl')

// 已知的荷兰语女声：iOS（Claire/Ellen）、Windows（Colette/Fenna）、Chrome（Google Nederlands）
const FEMALE = ['claire', 'colette', 'fenna', 'ellen', 'google nederlands']
const MALE = ['xander', 'maarten', 'rua']

/** 越高越优先：荷兰（nl-NL）女声 + 高音质（Premium/Enhanced/Natural）最优 */
function score(v: SpeechSynthesisVoice): number {
  const n = v.name.toLowerCase()
  let s = 0
  if (FEMALE.some((x) => n.includes(x))) s += 100
  if (MALE.some((x) => n.includes(x))) s -= 100
  if (/premium|enhanced|natural|neural|online|高级|增强/.test(n)) s += 30
  if (v.lang.replace('_', '-') === 'nl-NL') s += 10
  if (!v.localService) s += 5
  return s
}

export function dutchVoices(): SpeechSynthesisVoice[] {
  load()
  return voices.filter(isDutch).sort((a, b) => score(b) - score(a))
}

export function hasDutchVoice(): boolean {
  return dutchVoices().length > 0
}

/** 用户在设置里选的声音优先，否则自动选最好的女声 */
export function currentVoice(): SpeechSynthesisVoice | undefined {
  const list = dutchVoices()
  const chosen = settings.voiceURI
  return list.find((v) => v.voiceURI === chosen) ?? list[0]
}

export type Who = 'f' | 'm'

/** 系统朗读时的男声：优先已知男声名，其次任何非已知女声，最后退回女声 */
function systemVoice(who: Who): SpeechSynthesisVoice | undefined {
  if (who === 'f') return currentVoice()
  const list = dutchVoices()
  return (
    list.find((v) => MALE.some((x) => v.name.toLowerCase().includes(x))) ??
    list.find((v) => !FEMALE.some((x) => v.name.toLowerCase().includes(x))) ??
    currentVoice()
  )
}

// 预生成的神经语音（public/audio，由 scripts/gen-audio.ts 生成）。有就优先用，没有再退回系统朗读。
// 清单键：女声 = 文本本身；男声 = "m|" + 文本。
let manifest: Record<string, string> = {}
const audioBase = `${import.meta.env.BASE_URL}audio/`
fetch(`${audioBase}index.json`)
  .then((r) => (r.ok ? r.json() : {}))
  .then((m) => { if (m && typeof m === 'object') manifest = m as Record<string, string> })
  .catch(() => { /* 离线且未缓存：忽略，退回系统朗读 */ })

const keyOf = (text: string, who: Who) => (who === 'm' ? `m|${text}` : text)

export function hasRecordedAudio(text: string, who: Who = 'f'): boolean {
  return !!manifest[keyOf(text, who)]
}

// iOS 只有在用户点击后才允许播放；复用同一个 <audio> 元素，后续连续播放才不会被拦截。
const shared: HTMLAudioElement | null = typeof Audio !== 'undefined' ? new Audio() : null
let stopCurrent: (() => void) | null = null

function stopAll() {
  stopCurrent?.()
  stopCurrent = null
  shared?.pause()
  try { window.speechSynthesis?.cancel() } catch { /* 忽略 */ }
}

function playFile(file: string, rate: number): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!shared) return reject(new Error('no audio'))
    shared.onended = () => resolve()
    shared.onerror = () => reject(new Error('audio error'))
    shared.src = audioBase + file
    shared.playbackRate = rate
    shared.play().catch(reject)
  })
}

function speakSystem(text: string, rate: number, who: Who): Promise<void> {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) return resolve()
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'nl-NL'
    const v = systemVoice(who)
    if (v) u.voice = v
    u.rate = rate
    u.onend = () => resolve()
    u.onerror = () => resolve()
    window.speechSynthesis.speak(u)
  })
}

async function say(text: string, rate: number, who: Who) {
  const file = manifest[keyOf(text, who)]
  if (file) {
    try { await playFile(file, rate); return } catch { /* 退回系统朗读 */ }
  }
  await speakSystem(text, rate, who)
}

/** 必须由用户点击触发（iOS 限制）。点击回调里同步调用，不要先 await。 */
export function speak(text: string, rate = 0.85, who: Who = 'f') {
  stopAll()
  // 预录音频本身语速已略慢，所以把朗读速度换算成较温和的播放速度
  void say(text, hasRecordedAudio(text, who) ? Math.min(1, rate + 0.15) : rate, who)
}

export interface Line { text: string; who: Who }

/** 依次朗读多句（对话/通知）。返回 stop()；播完或被打断时 done 会 resolve。 */
export function speakLines(
  lines: Line[],
  opts: { slow?: boolean; onIndex?: (i: number) => void } = {},
): { stop: () => void; done: Promise<void> } {
  stopAll()
  let stopped = false
  const rate = opts.slow ? 0.75 : 1
  const done = (async () => {
    for (let i = 0; i < lines.length; i++) {
      if (stopped) break
      opts.onIndex?.(i)
      await say(lines[i].text, rate, lines[i].who)
      if (stopped) break
      await new Promise((r) => setTimeout(r, 450)) // 说话人之间的停顿
    }
    opts.onIndex?.(-1)
  })()
  const stop = () => { stopped = true; stopAll() }
  stopCurrent = stop
  return { stop, done }
}

export function stopSpeaking() { stopAll() }
