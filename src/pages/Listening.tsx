import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getReviews } from '../db/db'
import { LISTENING } from '../data/listening'
import type { ReviewRecord } from '../types'

export default function Listening() {
  const [rev, setRev] = useState<Record<string, ReviewRecord>>({})
  useEffect(() => { getReviews().then(setRev) }, [])
  const now = Date.now()

  return (
    <div>
      <h1>听力</h1>
      <p className="muted">仿 A2 考试：先听（最多听两三遍），再回答选择题，答完才显示原文和中文。</p>
      <Link className="btn full" to="/dictation">✍️ 去做听写</Link>
      {LISTENING.map((p, i) => {
        const r = rev[`ls:${p.id}`]
        return (
          <Link key={p.id} className="card link row" to={`/listening/${p.id}`}>
            <div className="num">{i + 1}</div>
            <div className="grow">
              <b>{p.title}</b>
              <div className="muted small">{p.kind === 'dialogue' ? '对话' : '通知/留言'} · {p.questions.length} 题</div>
            </div>
            {r ? <span className="tag">{r.due <= now ? '该复习' : '已完成'}</span> : <span>›</span>}
          </Link>
        )
      })}
    </div>
  )
}
