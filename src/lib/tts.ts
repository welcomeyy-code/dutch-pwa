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

/** 必须由用户点击触发（iOS 限制） */
export function speak(text: string, rate = 0.85) {
  if (!('speechSynthesis' in window)) return
  const synth = window.speechSynthesis
  synth.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'nl-NL'
  const v = currentVoice()
  if (v) u.voice = v
  u.rate = rate
  synth.speak(u)
}
