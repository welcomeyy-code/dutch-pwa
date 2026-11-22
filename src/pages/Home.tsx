import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getReviews, getWords } from '../db/db'

export default function Home() {
  const [stat, setStat] = useState({ total: 0, due: 0, fresh: 0 })
  useEffect(() => {
    Promise.all([getWords(), getReviews()]).then(([words, reviews]) => {
      const now = Date.now()
      const ids = Object.keys(words)
      const fresh = ids.filter((id) => !reviews[id]).length
      const due = ids.filter((id) => reviews[id] && reviews[id].due <= now).length
      setStat({ total: ids.length, due, fresh })
    })
  }, [])

  return (
    <div>
      <h1>Nederlands 🇳🇱</h1>
      <p className="muted">给中文母语者的荷兰语入门工具：词汇、发音、拍照解读（A1–A2）。</p>
      <div className="card hero">
        <div className="big">{stat.due}</div>
        <div>张待复习 · {stat.fresh} 张新词 · 共 {stat.total} 词</div>
        <Link className="btn primary" to="/review">开始复习</Link>
      </div>
      <div className="grid2">
        <Link className="card link" to="/grammar"><b>📘 语法课</b><span className="muted">18 课 A1–A2 语法 + 练习</span></Link>
        <Link className="card link" to="/pronounce"><b>🗣️ 发音</b><span className="muted">全部元音、辅音、规则</span></Link>
        <Link className="card link" to="/scan"><b>📷 拍照解读</b><span className="muted">看不懂的荷兰语，拍下来问 AI</span></Link>
        <Link className="card link" to="/practice"><b>✏️ 全部练习</b><span className="muted">听说读写，持续增加中</span></Link>
      </div>
    </div>
  )
}
