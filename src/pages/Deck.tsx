import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { deleteWord, getWords } from '../db/db'
import type { Word } from '../types'
import SpeakButton from '../components/SpeakButton'
import { displayWord } from '../components/wordUtil'

export default function Deck() {
  const [words, setWords] = useState<Word[]>([])
  const [q, setQ] = useState('')
  const refresh = () => getWords().then((w) => setWords(Object.values(w)))
  useEffect(() => { refresh() }, [])

  const list = useMemo(() => {
    const s = q.trim().toLowerCase()
    return words
      .filter((w) => !s || w.nl.toLowerCase().includes(s) || w.zh.some((z) => z.includes(s)))
      .sort((a, b) => b.createdAt - a.createdAt || a.nl.localeCompare(b.nl))
  }, [words, q])

  return (
    <div>
      <h1>我的卡组 <small className="muted">{words.length}</small></h1>
      <Link className="btn primary" style={{ width: '100%', marginBottom: 6 }} to="/library">📖 从词库添加（A1+A2 共 1608 词）</Link>
      <input className="input" placeholder="搜索荷兰语或中文" value={q} onChange={(e) => setQ(e.target.value)} />
      {list.map((w) => (
        <div key={w.id} className="card row">
          <div className="grow">
            <div><b>{displayWord(w)}</b> <span className="ipa">{w.ipa}</span> <span className="tag">{w.source === 'photo' ? '拍照' : '词库'}</span></div>
            <div>{w.zh.join('；')}</div>
            <div className="muted">{w.level} · {w.topic}</div>
          </div>
          <SpeakButton text={displayWord(w)} />
          <button
            className="btn small danger"
            onClick={async () => {
              if (confirm(`从卡组删除「${displayWord(w)}」？`)) { await deleteWord(w.id); refresh() }
            }}
          >删除</button>
        </div>
      ))}
    </div>
  )
}
