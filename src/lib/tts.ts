let voices: SpeechSynthesisVoice[] = []

function load() {
  if (!('speechSynthesis' in window)) return
  voices = window.speechSynthesis.getVoices()
}
if ('speechSynthesis' in window) {
  load()
  window.speechSynthesis.addEventListener?.('voiceschanged', load)
}

export function hasDutchVoice(): boolean {
  load()
  return voices.some((v) => v.lang.replace('_', '-').toLowerCase().startsWith('nl'))
}

/** 必须由用户点击触发（iOS 限制） */
export function speak(text: string, rate = 0.85) {
  if (!('speechSynthesis' in window)) return
  load()
  const synth = window.speechSynthesis
  synth.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'nl-NL'
  const v =
    voices.find((x) => x.lang.replace('_', '-') === 'nl-NL') ??
    voices.find((x) => x.lang.toLowerCase().startsWith('nl'))
  if (v) u.voice = v
  u.rate = rate
  synth.speak(u)
}
