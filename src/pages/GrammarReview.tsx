import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getReviews } from '../db/db'
import { LESSONS } from '../data/grammar'
import ExerciseRunner, { type RunItem } from '../components/ExerciseRunner'

export default function GrammarReview() {
  const nav = useNavigate()
  const [items, setItems] = useState<RunItem[] | null>(null)

  useEffect(() => {
    getReviews().then((rev) => {
      const now = Date.now()
      const out: RunItem[] = []
      for (const r of Object.values(rev)) {
        if (!r.wordId.startsWith('ex:') || r.due > now) continue
        const [, lessonId, n] = r.wordId.split(':')
        const exercise = LESSONS.find((l) => l.id === lessonId)?.exercises[Number(n)]
        if (exercise) out.push({ key: r.wordId, exercise })
      }
      out.sort((a, b) => (rev[a.key].due - rev[b.key].due))
      setItems(out.slice(0, 20))
    })
  }, [])

  if (!items) return <p className="muted">加载中…</p>
  if (items.length === 0)
    return (
      <div className="card center">
        <h2>今天没有要复习的语法题 🎉</h2>
        <p className="muted">先去做几节语法课的练习，答错的题会出现在这里。</p>
        <Link className="btn" to="/grammar">去语法课</Link>
      </div>
    )
  return (
    <div>
      <h1>语法复习</h1>
      <ExerciseRunner items={items} onDone={() => nav('/grammar')} />
    </div>
  )
}
