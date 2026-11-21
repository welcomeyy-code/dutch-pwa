import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { addWords, getWords } from '../db/db'
import { loadCore } from '../lib/library'
import type { POS, Word } from '../types'
import SpeakButton from '../components/SpeakButton'
import { POS_ZH, displayWord } from '../components/wordUtil'

const PAGE = 100

export default function Library() {
  const [all, setAll] = useState<Word[] | null>(null)
  const [have, setHave] = useState<Set<string>>(new Set())
  const [level, setLevel] = useState('')
  const [pos, setPos] = useState('')
  const [theme, setTheme] = useState('')
  const [q, setQ] = useState('')
  const [hideAdded, setHideAdded] = useState(false)
  const [limit, setLimit] = useState(PAGE)
  const [msg, setMsg] = useState('')

  const refresh = async () => setHave(new Set(Object.keys(await getWords())))
  useEffect(() => { loadCore().then(setAll); refresh() }, [])

  const themes = useMemo(() => [...new Set((all ?? []).flatMap((w) => w.themes ?? []))].sort(), [all])
  const list = useMemo(() => {
    const s = q.trim().toLowerCase()
    return (all ?? []).filter((w) =>
      (!level || w.level === level) &&
      (!pos || w.pos === pos) &&
      (!theme || w.themes?.includes(theme)) &&
      (!hideAdded || !have.has(w.id)) &&
      (!s || w.nl.toLowerCase().includes(s) || w.zh.some((z) => z.includes(s))),
    )
  }, [all, level, pos, theme, q, hideAdded, have])

  const addList = async (ws: Word[]) => {
    const todo = ws.filter((w) => !have.has(w.id))
    if (!todo.length) { setMsg('这些词都已在卡组里'); return }
    if (todo.length > 100 && !confirm(`将加入 ${todo.length} 个词，确定吗？`)) return
    const n = await addWords(todo.map((w) => ({ ...w, createdAt: Date.now(), updatedAt: Date.now() })))
    setMsg(`已加入 ${n} 个词`)
    refresh()
  }

  if (!all) return <p className="muted">加载词库…</p>
  return (
    <div>
      <h1>词库 <small className="muted">{all.length}</small></h1>
      <p className="muted">A1+A2 核心词（NT2Lex）。新词按常用度排序出现在复习里，每次最多 10 个。<Link to="/deck">回卡组</Link></p>

      <input className="input" placeholder="搜索荷兰语或中文" value={q} onChange={(e) => { setQ(e.target.value); setLimit(PAGE) }} />
      <div className="grid2">
        <select className="input" value={level} onChange={(e) => { setLevel(e.target.value); setLimit(PAGE) }}>
          <option value="">全部级别</option><option value="A1">A1</option><option value="A2">A2</option>
        </select>
        <select className="input" value={pos} onChange={(e) => { setPos(e.target.value); setLimit(PAGE) }}>
          <option value="">全部词性</option>
          {(Object.keys(POS_ZH) as POS[]).map((p) => <option key={p} value={p}>{POS_ZH[p]}</option>)}
        </select>
      </div>
      <select className="input" value={theme} onChange={(e) => { setTheme(e.target.value); setLimit(PAGE) }}>
        <option value="">全部主题</option>
        {themes.map((t) => <option key={t} value={t}>{t}</option>)}
      </select>
      <label className="row muted"><input type="checkbox" checked={hideAdded} onChange={(e) => setHideAdded(e.target.checked)} /> 隐藏已加入</label>

      <div className="row">
        <span className="grow muted">{list.length} 个结果</span>
        <button className="btn small primary" onClick={() => addList(list)}>加入全部结果</button>
      </div>
      {msg && <div className="card">{msg}</div>}

      {list.slice(0, limit).map((w) => {
        const added = have.has(w.id)
        return (
          <div key={w.id} className="card row">
            <div className="grow">
              <div><b>{displayWord(w)}</b> <span className="ipa">{w.ipa}</span></div>
              <div>{w.zh.join('；')}</div>
              <div className="muted">{POS_ZH[w.pos]} · {w.level}{w.themes?.length ? ' · ' + w.themes.join('/') : ''}</div>
            </div>
            <SpeakButton text={displayWord(w)} />
            <button className="btn small" disabled={added} onClick={() => addList([w])}>{added ? '已加入' : '＋'}</button>
          </div>
        )
      })}
      {list.length > limit && <button className="btn" style={{ width: '100%' }} onClick={() => setLimit(limit + PAGE)}>显示更多</button>}
    </div>
  )
}
