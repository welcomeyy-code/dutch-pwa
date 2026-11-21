import { speak } from '../lib/tts'

export default function SpeakButton({ text, rate, label = '朗读' }: { text: string; rate?: number; label?: string }) {
  return (
    <button type="button" className="speak" aria-label={`${label} ${text}`} onClick={(e) => { e.stopPropagation(); speak(text, rate) }}>
      🔊
    </button>
  )
}
