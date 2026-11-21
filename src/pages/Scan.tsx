import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { addScan, addWords, getScans, getWords } from '../db/db'
import { hasScanKey, scanImage } from '../lib/scan'
import { fileToBase64Jpeg } from '../lib/image'
import type { PhotoScan, ScanWord, Word } from '../types'
import SpeakButton from '../components/SpeakButton'
import { displayWord, wordId } from '../components/wordUtil'

export default function Scan() {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [scan, setScan] = useState<PhotoScan | null>(null)
  const [have, setHave] = useState<Set<string>>(new Set())
  const [history, setHistory] = useState<PhotoScan[]>([])

  const refresh = async () => {
    setHave(new Set(Object.keys(await getWords())))
    setHistory(Object.values(await getScans()).sort((a, b) => b.createdAt - a.createdAt).slice(0, 10))
  }
  useEffect(() => { refresh() }, [])

  const onFile = async (file?: File) => {
    if (!file) return
    setError(''); setBusy(true); setScan(null)
    try {
      const b64 = await fileToBase64Jpeg(file)
      const r = await scanImage(b64)
      const now = Date.now()
      const s: PhotoScan = { ...r, id: `scan-${now}`, createdAt: now, updatedAt: now }
      await addScan(s)
      setScan(s)
      refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setBusy(false)
    }
  }

  const toWord = (s: ScanWord): Word => {
    const now = Date.now()
    return {
      id: wordId(s.nl, s.pos), nl: s.nl, article: s.article, pos: s.pos, zh: s.zh, ipa: s.ipa,
      examples: s.example ? [s.example] : [], level: s.level ?? 'A2', topic: '拍照', source: 'photo',
      createdAt: now, updatedAt: now,
    }
  }
  const add = async (list: ScanWord[]) => { await addWords(list.map(toWord)); refresh() }

  return (
    <div>
      <h1>拍照解读</h1>
      {!hasScanKey() && <div className="card warn">还没有 API key，请先到<Link to="/settings">设置</Link>填写（Gemini 有免费额度）。</div>}
      <div className="row">
        <label className="btn primary grow">
          📷 拍照
          <input type="file" accept="image/*" capture="environment" hidden disabled={busy} onChange={(e) => { onFile(e.target.files?.[0]); e.target.value = '' }} />
        </label>
        <label className="btn grow">
          🖼️ 选图
          <input type="file" accept="image/*" hidden disabled={busy} onChange={(e) => { onFile(e.target.files?.[0]); e.target.value = '' }} />
        </label>
      </div>
      {busy && <p className="muted">AI 正在解读，请稍等…</p>}
      {error && <div className="card warn">{error}</div>}

      {scan && (
        <>
          <h2>原文</h2>
          <div className="card pre">{scan.text || '（没有识别到荷兰语）'} {scan.text && <SpeakButton text={scan.text} rate={0.8} />}</div>

          {scan.words.length > 0 && (
            <>
              <div className="row">
                <h2 className="grow">逐词释义</h2>
                <button className="btn small" onClick={() => add(scan.words.filter((w) => !have.has(wordId(w.nl, w.pos))))}>全部加入</button>
              </div>
              {scan.words.map((s, i) => {
                const id = wordId(s.nl, s.pos)
                const added = have.has(id)
                return (
                  <div key={i} className="card row">
                    <div className="grow">
                      <div><b>{displayWord(s)}</b> <span className="ipa">{s.ipa}</span> <span className="tag">{s.pos}</span> <span className="tag">{s.level}</span></div>
                      <div>{s.zh.join('；')}</div>
                      {s.formInText && s.formInText.toLowerCase() !== s.nl.toLowerCase() && <div className="muted">原文形式：{s.formInText}</div>}
                    </div>
                    <SpeakButton text={displayWord(s)} />
                    <button className="btn small" disabled={added} onClick={() => add([s])}>{added ? '已加入' : '＋ 卡组'}</button>
                  </div>
                )
              })}
            </>
          )}

          {scan.grammarZh && (
            <>
              <h2>语法讲解</h2>
              <div className="card pre">{scan.grammarZh}</div>
            </>
          )}
        </>
      )}

      {history.length > 0 && !scan && (
        <>
          <h2>最近解读</h2>
          {history.map((h) => (
            <div key={h.id} className="card link" onClick={() => setScan(h)}>
              <div className="clip">{h.text || '（空）'}</div>
              <small className="muted">{new Date(h.createdAt).toLocaleString()} · {h.words.length} 词</small>
            </div>
          ))}
        </>
      )}
    </div>
  )
}
