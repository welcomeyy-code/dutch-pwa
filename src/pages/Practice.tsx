import { Link } from 'react-router-dom'

const READY = [
  { to: '/grammar', icon: '📘', title: '语法课', desc: '18 课 A1–A2 语法，讲解 + 练习 + 错题复习' },
  { to: '/pronounce', icon: '🗣️', title: '发音', desc: '全部元音、辅音和拼读规则，配图和例词' },
  { to: '/scan', icon: '📷', title: '拍照解读', desc: '拍下看不懂的荷兰语，逐词释义和语法讲解' },
]
const SOON = [
  ['🎧', '听力', '对话和通知，仿考试选择题'],
  ['✍️', '听写', '听句子，写下来'],
  ['🎤', '口语', '听问题、录音回答、AI 反馈内容'],
  ['📝', '写作', '短信、便条、填表，AI 批改'],
  ['📖', '阅读', '标牌、邮件、广告，配选择题'],
  ['⏱️', '模拟考试', '按考试时间串起各项，生成弱项报告'],
]

export default function Practice() {
  return (
    <div>
      <h1>练习</h1>
      <p className="muted">对照 A2 考试的听、说、读、写来练。</p>
      {READY.map((r) => (
        <Link key={r.to} className="card link row" to={r.to}>
          <span className="big-icon">{r.icon}</span>
          <div className="grow"><b>{r.title}</b><div className="muted small">{r.desc}</div></div>
          <span>›</span>
        </Link>
      ))}
      <h2>开发中</h2>
      {SOON.map(([icon, title, desc]) => (
        <div key={title} className="card row soon">
          <span className="big-icon">{icon}</span>
          <div className="grow"><b>{title}</b><div className="muted small">{desc}</div></div>
          <span className="tag">即将推出</span>
        </div>
      ))}
    </div>
  )
}
