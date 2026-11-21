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

// 预生成的真人级神经语音（public/audio，由 scripts/gen-audio.ts 生成）。有就优先用，没有再退回系统朗读。
let manifest: Record<string, string> = {}
const audioBase = `${import.meta.env.BASE_URL}audio/`
fetch(`${audioBase}index.json`)
  .then((r) => (r.ok ? r.json() : {}))
  .then((m) => { if (m && typeof m === 'object') manifest = m as Record<string, string> })
  .catch(() => { /* 离线且未缓存：忽略，退回系统朗读 */ })

let player: HTMLAudioElement | null = null

export function hasRecordedAudio(text: string): boolean {
  return !!manifest[text]
}

/** 必须由用户点击触发（iOS 限制）。点击回调里同步调用，不要先 await。 */
export function speak(text: string, rate = 0.85) {
  const file = manifest[text]
  if (file) {
    try { window.speechSynthesis?.cancel() } catch { /* 忽略 */ }
    player?.pause()
    const a = new Audio(audioBase + file)
    player = a
    a.play().catch(() => speakSystem(text, rate)) // 播放失败时退回系统朗读
    return
  }
  speakSystem(text, rate)
}

function speakSystem(text: string, rate: number) {
  if (!('speechSynthesis' in window)) return
  player?.pause()
  const synth = window.speechSynthesis
  synth.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'nl-NL'
  const v = currentVoice()
  if (v) u.voice = v
  u.rate = rate
  synth.speak(u)
}
