import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getReviews } from '../db/db'
import { LESSONS } from '../data/grammar'
import type { ReviewRecord } from '../types'

export default function GrammarList() {
  const [rev, setRev] = useState<Record<string, ReviewRecord>>({})
  useEffect(() => { getReviews().then(setRev) }, [])
  const now = Date.now()
  const due = Object.values(rev).filter((r) => r.wordId.startsWith('ex:') && r.due <= now).length

  return (
    <div>
      <h1>语法课</h1>
      <p className="muted">{LESSONS.length} 课，覆盖 A1–A2 常用语法。每课：先读讲解，再做练习；答错的题会进入复习队列。</p>
      <Link className={`btn ${due ? 'primary' : ''} full`} to="/grammar/review">🔁 复习语法错题 {due > 0 ? `（${due}）` : '（今天没有）'}</Link>
      {LESSONS.map((l, idx) => {
        const done = l.exercises.filter((_, n) => rev[`ex:${l.id}:${n}`]).length
        return (
          <Link key={l.id} className="card link row" to={`/grammar/${l.id}`}>
            <div className="num">{idx + 1}</div>
            <div className="grow">
              <b>{l.title}</b>
              <div className="muted small">{l.level} · 练习 {done}/{l.exercises.length}</div>
            </div>
            <span>›</span>
          </Link>
        )
      })}
    </div>
  )
}
