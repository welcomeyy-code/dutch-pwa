import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { getReviews, saveReview } from '../db/db'
import { buildDictationPool, type DictationItem } from '../data/dictation'
import { schedule, type Grade } from '../lib/srs'
import { speak } from '../lib/tts'
import type { ReviewRecord } from '../types'

const SESSION = 8

const norm = (w: string) => w.toLowerCase().replace(/[’‘]/g, "'").replace(/[.,!?;:"“”()]/g, '')
const tokens = (s: string) => s.trim().split(/\s+/).filter(Boolean)

/** 逐词对齐（最长公共子序列）：返回参考句每个词是否被写对，以及多写的词 */
function diff(ref: string, typed: string) {
  const a = tokens(ref)
  const b = tokens(typed)
  const dp = Array.from({ length: a.length + 1 }, () => new Array<number>(b.length + 1).fill(0))
  for (let i = a.length - 1; i >= 0; i--)
    for (let j = b.length - 1; j >= 0; j--)
      dp[i][j] = norm(a[i]) === norm(b[j]) ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1])
  const hit = new Array<boolean>(a.length).fill(false)
  const used = new Array<boolean>(b.length).fill(false)
  let i = 0, j = 0
  while (i < a.length && j < b.length) {
    if (norm(a[i]) === norm(b[j])) { hit[i] = true; used[j] = true; i++; j++ }
    else if (dp[i + 1][j] >= dp[i][j + 1]) i++
    else j++
  }
  return { words: a.map((w, k) => ({ w, ok: hit[k] })), extra: b.filter((_, k) => !used[k]), accuracy: a.length ? hit.filter(Boolean).length / a.length : 0 }
}

export default function Dictation() {
  const pool = useMemo(buildDictationPool, [])
  const [queue, setQueue] = useState<DictationItem[] | null>(null)
  const [i, setI] = useState(0)
  const [text, setText] = useState('')
  const [result, setResult] = useState<ReturnType<typeof diff> | null>(null)
  const [scores, setScores] = useState<number[]>([])
  const reviews = useRef<Record<string, ReviewRecord>>({})

  useEffect(() => {
    getReviews().then((rev) => {
      reviews.current = rev
      const now = Date.now()
      const due = pool.filter((p) => rev[p.key] && rev[p.key].due <= now).sort((a, b) => rev[a.key].due - rev[b.key].due)
      const fresh = pool.filter((p) => !rev[p.key])
      for (let k = fresh.length - 1; k > 0; k--) { const r = Math.floor(Math.random() * (k + 1)); [fresh[k], fresh[r]] = [fresh[r], fresh[k]] }
      setQueue([...due, ...fresh].slice(0, SESSION))
    })
  }, [pool])

  if (!queue) return <p className="muted">加载中…</p>
  const item = queue[i]

  if (!item)
    return (
      <div className="card center">
        <h2>听写完成 🎉</h2>
        <div className="big-score">{scores.length ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 100) : 0}%</div>
        <p className="muted">平均词准确率。写错的句子会更快再出现。</p>
        <Link className="btn" to="/practice">返回练习</Link>
      </div>
    )

  const check = async () => {
    const d = diff(item.text, text)
    setResult(d)
    setScores([...scores, d.accuracy])
    const grade: Grade = d.accuracy >= 0.9 ? 2 : d.accuracy >= 0.6 ? 1 : 0
    const rec = schedule(item.key, reviews.current[item.key], grade)
    reviews.current[item.key] = rec
    await saveReview(rec)
  }
  const next = () => { setI(i + 1); setText(''); setResult(null) }

  return (
    <div>
      <p><Link to="/listening">‹ 听力</Link></p>
      <h1>听写</h1>
      <p className="muted">第 {i + 1} / {queue.length} 句。听一句，把它写下来（大小写和标点不影响判分）。</p>

      <div className="card center">
        <div className="row" style={{ justifyContent: 'center' }}>
          <button className="btn primary" onClick={() => speak(item.text, 0.95, item.who)}>▶ 播放</button>
          <button className="btn" onClick={() => speak(item.text, 0.65, item.who)}>🐢 慢速</button>
        </div>
      </div>

      <textarea className="input" rows={3} autoCapitalize="off" autoCorrect="off" spellCheck={false}
        disabled={!!result} value={text} onChange={(e) => setText(e.target.value)} placeholder="在这里写下你听到的句子" />

      {!result ? (
        <button className="btn primary full" disabled={!text.trim()} onClick={check}>检查</button>
      ) : (
        <>
          <div className="card">
            <div className="q">
              {result.words.map((x, k) => <span key={k} className={x.ok ? 'dw ok' : 'dw bad'}>{x.w} </span>)}
            </div>
            {result.extra.length > 0 && <div className="muted small">多写的词：<s>{result.extra.join(' ')}</s></div>}
            <div className="muted">{item.zh}</div>
            <div>正确率 <b>{Math.round(result.accuracy * 100)}%</b></div>
            <button className="speak" aria-label="朗读" onClick={() => speak(item.text, 0.85, item.who)}>🔊</button>
          </div>
          <button className="btn primary full" onClick={next}>{i + 1 < queue.length ? '下一句' : '查看结果'}</button>
        </>
      )}
    </div>
  )
}
