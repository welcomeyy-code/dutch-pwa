import { useEffect, useMemo, useRef, useState } from 'react'
import { getReviews, saveReview } from '../db/db'
import { exerciseSentence } from '../data/grammar'
import { schedule } from '../lib/srs'
import type { Exercise, ReviewRecord } from '../types'
import SpeakButton from './SpeakButton'

export interface RunItem { key: string; exercise: Exercise }

const norm = (s: string) =>
  s.toLowerCase().replace(/[’‘]/g, "'").replace(/[.,!?;:"“”]/g, '').replace(/\s+/g, ' ').trim()

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** 依次做题；每题作答后写入 SRS（答对=记得，答错=重来），答错的题会更快再次出现 */
export default function ExerciseRunner({ items, onDone }: { items: RunItem[]; onDone: () => void }) {
  const [i, setI] = useState(0)
  const [picked, setPicked] = useState('')
  const [text, setText] = useState('')
  const [built, setBuilt] = useState<number[]>([])
  const [checked, setChecked] = useState<null | boolean>(null)
  const [results, setResults] = useState<{ item: RunItem; ok: boolean }[]>([])
  const reviews = useRef<Record<string, ReviewRecord>>({})
  useEffect(() => { getReviews().then((r) => { reviews.current = r }) }, [])

  const item = items[i]
  const e = item?.exercise
  const tokens = useMemo(() => {
    if (!e || e.type !== 'order') return []
    const base = e.answer.split(' ')
    let s = shuffle(base)
    for (let t = 0; t < 5 && s.join(' ') === base.join(' '); t++) s = shuffle(base)
    return s
  }, [e])

  if (!item || !e) {
    const right = results.filter((r) => r.ok).length
    const wrong = results.filter((r) => !r.ok)
    return (
      <div className="card center">
        <h2>完成 🎉</h2>
        <p className="big-score">{right} / {results.length}</p>
        {wrong.length > 0 && (
          <div className="left">
            <h3>需要再看的题</h3>
            {wrong.map((r, k) => (
              <div key={k} className="muted small">• {r.item.exercise.prompt} → <b>{r.item.exercise.answer}</b></div>
            ))}
            <p className="muted small">答错的题已经加入复习队列，稍后会再出现。</p>
          </div>
        )}
        <button className="btn primary" onClick={onDone}>完成</button>
      </div>
    )
  }

  const check = async () => {
    let ok = false
    if (e.type === 'choice') ok = picked === e.answer
    else if (e.type === 'fill') ok = [e.answer, ...(e.accept ?? [])].map(norm).includes(norm(text))
    else ok = [e.answer, ...(e.alts ?? [])].map(norm).includes(norm(built.map((b) => tokens[b]).join(' ')))
    setChecked(ok)
    setResults([...results, { item, ok }])
    const rec = schedule(item.key, reviews.current[item.key], ok ? 2 : 0)
    reviews.current[item.key] = rec
    await saveReview(rec)
  }

  const next = () => {
    setI(i + 1); setPicked(''); setText(''); setBuilt([]); setChecked(null)
  }

  const canCheck = e.type === 'choice' ? !!picked : e.type === 'fill' ? !!text.trim() : built.length === tokens.length
  const sentence = exerciseSentence(e)

  return (
    <div>
      <p className="muted">第 {i + 1} / {items.length} 题</p>
      <div className="card">
        <div className="q">{e.prompt}</div>
        {'hint' in e && e.hint && <div className="muted">{e.hint}</div>}

        {e.type === 'choice' && (
          <div className="opts">
            {e.options.map((o) => (
              <button key={o} disabled={checked !== null}
                className={`opt ${picked === o ? 'sel' : ''} ${checked !== null && o === e.answer ? 'right' : ''} ${checked === false && picked === o ? 'wrong' : ''}`}
                onClick={() => setPicked(o)}>{o}</button>
            ))}
          </div>
        )}

        {e.type === 'fill' && (
          <input className="input" autoCapitalize="off" autoCorrect="off" spellCheck={false} disabled={checked !== null}
            value={text} onChange={(ev) => setText(ev.target.value)}
            onKeyDown={(ev) => { if (ev.key === 'Enter' && canCheck && checked === null) check() }}
            placeholder="输入答案" />
        )}

        {e.type === 'order' && (
          <>
            <div className="built">
              {built.length === 0 && <span className="muted">点下面的词，按顺序组成句子</span>}
              {built.map((b, k) => (
                <button key={k} className="tok on" disabled={checked !== null} onClick={() => setBuilt(built.filter((_, x) => x !== k))}>{tokens[b]}</button>
              ))}
            </div>
            <div className="pool">
              {tokens.map((t, k) => (
                built.includes(k) ? null : <button key={k} className="tok" disabled={checked !== null} onClick={() => setBuilt([...built, k])}>{t}</button>
              ))}
            </div>
          </>
        )}

        {checked !== null && (
          <div className={`fb ${checked ? 'ok' : 'bad'}`}>
            <b>{checked ? '✅ 正确' : '❌ 不对'}</b>
            {!checked && <div>正确答案：<b>{e.answer}</b></div>}
            {e.explainZh && <div className="muted">{e.explainZh}</div>}
            {sentence && <div>{sentence} <SpeakButton text={sentence} /></div>}
          </div>
        )}
      </div>

      {checked === null
        ? <button className="btn primary full" disabled={!canCheck} onClick={check}>检查</button>
        : <button className="btn primary full" onClick={next}>{i + 1 < items.length ? '下一题' : '查看结果'}</button>}
    </div>
  )
}
