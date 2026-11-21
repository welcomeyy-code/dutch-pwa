import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getReviews, getWords, saveReview } from '../db/db'
import { previewLabel, schedule, type Grade } from '../lib/srs'
import type { ReviewRecord, Word } from '../types'
import SpeakButton from '../components/SpeakButton'
import { displayWord } from '../components/wordUtil'

const NEW_PER_SESSION = 10

export default function Review() {
  const [queue, setQueue] = useState<Word[] | null>(null)
  const [reviews, setReviews] = useState<Record<string, ReviewRecord>>({})
  const [shown, setShown] = useState(false)
  const [done, setDone] = useState(0)

  useEffect(() => {
    Promise.all([getWords(), getReviews()]).then(([words, rev]) => {
      const now = Date.now()
      const all = Object.values(words)
      const due = all.filter((w) => rev[w.id] && rev[w.id].due <= now).sort((a, b) => rev[a.id].due - rev[b.id].due)
      const fresh = all
        .filter((w) => !rev[w.id])
        .sort((a, b) => (a.freqRank ?? 0) - (b.freqRank ?? 0)) // 种子词优先，其后按常用度
        .slice(0, NEW_PER_SESSION)
      setReviews(rev)
      setQueue([...due, ...fresh])
    })
  }, [])

  if (!queue) return <p className="muted">加载中…</p>
  const card = queue[0]
  if (!card)
    return (
      <div className="card center">
        <h2>🎉 今天的复习完成了</h2>
        <p className="muted">本次复习了 {done} 张。</p>
        <Link className="btn" to="/">回首页</Link>
      </div>
    )

  const prev = reviews[card.id]
  const answer = async (g: Grade) => {
    const rec = schedule(card.id, prev, g)
    await saveReview(rec)
    setReviews({ ...reviews, [card.id]: rec })
    setDone(done + 1)
    setShown(false)
    // 「重来」的卡片稍后在本次队列里再出现一次
    setQueue(g === 0 ? [...queue.slice(1), card] : queue.slice(1))
  }

  return (
    <div>
      <p className="muted">剩余 {queue.length} 张</p>
      <div className="card flash" onClick={() => setShown(true)}>
        <div className="front">
          {displayWord(card)} <SpeakButton text={displayWord(card)} />
        </div>
        {!shown ? (
          <p className="muted">点击卡片显示答案</p>
        ) : (
          <div className="back">
            <div className="ipa">{card.ipa}</div>
            <div className="zh">{card.zh.join('；')}</div>
            {card.extra?.plural && card.extra.plural !== '—' && <div className="muted">复数：{card.extra.plural}</div>}
            {card.extra?.pastTense && <div className="muted">过去式：{card.extra.pastTense}</div>}
            {card.examples[0] && (
              <div className="ex">
                {card.examples[0].nl} <SpeakButton text={card.examples[0].nl} />
                <div className="muted">{card.examples[0].zh}</div>
              </div>
            )}
          </div>
        )}
      </div>
      {shown && (
        <div className="grades">
          {([['重来', 0], ['困难', 1], ['记得', 2], ['简单', 3]] as [string, Grade][]).map(([label, g]) => (
            <button key={g} className={`grade g${g}`} onClick={() => answer(g)}>
              {label}
              <small>{previewLabel(prev, g)}</small>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
