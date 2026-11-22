import { useState } from 'react'
import { PHONEMES, PHONEME_GROUPS } from '../data/phonemes'
import { hasDutchVoice } from '../lib/tts'
import SpeakButton from '../components/SpeakButton'
import { ConsonantChart, LipIcon, VowelChart } from '../components/PhonemeDiagrams'
import type { PhonemeCategory, PhonemeUnit } from '../types'

function Unit({ p, open, onToggle }: { p: PhonemeUnit; open: boolean; onToggle: () => void }) {
  return (
    <div className="card">
      <div className="row clickable" onClick={onToggle}>
        <div className="grow">
          <span className="phon">{p.grapheme}</span> <span className="ipa">{p.ipa}</span>
        </div>
        <span>{open ? '▲' : '▼'}</span>
      </div>
      <div className="muted">{p.summaryZh}</div>

      {open && (
        <>
          {(p.vowel || p.cons || p.lips) && (
            <div className="diagrams">
              {p.lips && <LipIcon lips={p.lips} />}
              {p.vowel && <VowelChart highlight={p.vowel} arrow={p.arrow} />}
              {p.cons && <ConsonantChart highlight={p.cons} />}
            </div>
          )}

          <h3>发音方法</h3>
          <p>{p.articulationZh}</p>

          {p.cnMistakesZh && p.cnMistakesZh.length > 0 && (
            <>
              <h3>中文母语者常见错误</h3>
              <ul>{p.cnMistakesZh.map((t, i) => <li key={i}>{t}</li>)}</ul>
            </>
          )}

          <h3>小贴士</h3>
          <ul>{p.tipsZh.map((t, i) => <li key={i}>{t}</li>)}</ul>

          <h3>例词（点喇叭听）</h3>
          <div className="exlist">
            {p.examples.map((m) => (
              <div key={m.nl} className="exrow">
                <SpeakButton text={m.nl} rate={0.75} />
                <b>{m.nl}</b> <span className="ipa">{m.ipa}</span>
                <span className="muted"> {m.zh}</span>
              </div>
            ))}
          </div>

          {p.minimalPairs.length > 0 && (
            <>
              <h3>对比词（听出差别）</h3>
              <div className="pairs">
                {p.minimalPairs.map((m) => (
                  <div key={m.nl + m.ipa} className={`pair ${m.contrast ? 'contrast' : 'target'}`}>
                    <div><b>{m.nl}</b> <SpeakButton text={m.nl} rate={0.7} /></div>
                    <div className="ipa">{m.ipa}</div>
                    <div className="muted">{m.zh}</div>
                  </div>
                ))}
              </div>
              <p className="muted small">橙色边框是本节要练的音，灰色边框是容易混淆的对比音。</p>
            </>
          )}
        </>
      )}
    </div>
  )
}

export default function Pronunciation() {
  const [group, setGroup] = useState<PhonemeCategory>('short')
  const [openId, setOpenId] = useState('')
  const info = PHONEME_GROUPS.find((g) => g.id === group)!
  const list = PHONEMES.filter((p) => p.category === group)

  return (
    <div>
      <h1>发音</h1>
      {!hasDutchVoice() && (
        <div className="card warn">
          没有找到荷兰语系统声音。词库里的词有预录音频，不受影响；其他内容会用系统声音：iPhone 到「设置 → 辅助功能 → 朗读内容 → 声音 → 荷兰语」下载。
        </div>
      )}

      <div className="chips">
        {PHONEME_GROUPS.map((g) => (
          <button key={g.id} className={g.id === group ? 'chip on' : 'chip'} onClick={() => { setGroup(g.id); setOpenId('') }}>
            {g.title} <small>{PHONEMES.filter((p) => p.category === g.id).length}</small>
          </button>
        ))}
      </div>
      <p className="muted">{info.hint}</p>

      {list.map((p) => (
        <Unit key={p.id} p={p} open={openId === p.id} onToggle={() => setOpenId(openId === p.id ? '' : p.id)} />
      ))}

      <p className="muted small">图示是教学用的示意图，不是真人口腔照片；中文类比只是近似，请以听音为准，并尽量多听真人发音。</p>
    </div>
  )
}
