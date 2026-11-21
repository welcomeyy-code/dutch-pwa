import { useState } from 'react'
import { PHONEMES } from '../data/phonemes'
import { hasDutchVoice } from '../lib/tts'
import SpeakButton from '../components/SpeakButton'

export default function Pronunciation() {
  const [open, setOpen] = useState(PHONEMES[0].id)
  return (
    <div>
      <h1>发音难点</h1>
      {!hasDutchVoice() && (
        <div className="card warn">
          没有找到荷兰语语音。请到 iPhone「设置 → 辅助功能 → 朗读内容 → 声音 → 荷兰语」下载一个声音。
        </div>
      )}
      <p className="muted">iOS 朗读只能作参考，最小对立词的差别可能不够明显，建议多听真人发音。</p>
      {PHONEMES.map((p) => (
        <div key={p.id} className="card">
          <div className="row" onClick={() => setOpen(open === p.id ? '' : p.id)}>
            <div className="grow"><span className="phon">{p.grapheme}</span> <span className="ipa">{p.ipa}</span></div>
            <span>{open === p.id ? '▲' : '▼'}</span>
          </div>
          <div className="muted">{p.summaryZh}</div>
          {open === p.id && (
            <>
              <h3>舌位与唇形</h3>
              <p>{p.articulationZh}</p>
              <h3>小贴士</h3>
              <ul>{p.tipsZh.map((t, i) => <li key={i}>{t}</li>)}</ul>
              <h3>对比词（点喇叭听）</h3>
              <div className="pairs">
                {p.minimalPairs.map((m) => (
                  <div key={m.nl} className={`pair ${m.contrast ? 'contrast' : 'target'}`}>
                    <div><b>{m.nl}</b> <SpeakButton text={m.nl} rate={0.7} /></div>
                    <div className="ipa">{m.ipa}</div>
                    <div className="muted">{m.zh}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  )
}
