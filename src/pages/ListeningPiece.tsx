import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getReviews, saveReview } from '../db/db'
import { LISTENING } from '../data/listening'
import { schedule } from '../lib/srs'
import { speak, speakLines, stopSpeaking } from '../lib/tts'

export default function ListeningPiece() {
  const { id } = useParams()
  const piece = LISTENING.find((p) => p.id === id)
  const [playing, setPlaying] = useState(false)
  const [current, setCurrent] = useState(-1)
  const [plays, setPlays] = useState(0)
  const [slow, setSlow] = useState(false)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [checked, setChecked] = useState(false)
  const handle = useRef<ReturnType<typeof speakLines> | null>(null)

  useEffect(() => {
    setAnswers(piece ? piece.questions.map(() => null) : [])
    return () => stopSpeaking()
  }, [piece])

  if (!piece) return <div><p>找不到这段听力。</p><Link to="/listening">返回</Link></div>

  const play = async () => {
    setPlaying(true)
    const h = speakLines(piece.lines.map((l) => ({ text: l.nl, who: l.who })), { slow, onIndex: setCurrent })
    handle.current = h
    await h.done
    setPlaying(false)
    setPlays((n) => n + 1)
  }
  const stop = () => { handle.current?.stop(); setPlaying(false); setCurrent(-1) }

  const score = piece.questions.filter((q, i) => answers[i] === q.answer).length
  const total = piece.questions.length
  const check = async () => {
    stop()
    setChecked(true)
    const reviews = await getReviews()
    const key = `ls:${piece.id}`
    const grade = score === total ? 3 : score >= Math.ceil(total * 0.67) ? 2 : 0
    await saveReview(schedule(key, reviews[key], grade))
  }
  const retry = () => { setAnswers(piece.questions.map(() => null)); setChecked(false); setPlays(0) }

  return (
    <div>
      <p><Link to="/listening">‹ 听力</Link></p>
      <h1>{piece.title}</h1>

      <div className="card center">
        {!playing
          ? <button className="btn primary" onClick={play}>▶ 播放{plays > 0 ? '（再听一遍）' : ''}</button>
          : <button className="btn" onClick={stop}>■ 停止</button>}
        <label className="row muted center-row"><input type="checkbox" checked={slow} onChange={(e) => setSlow(e.target.checked)} /> 慢速</label>
        <div className="muted small">已听 {plays} 遍{plays >= 2 && !checked ? ' · 考试里一般只能听两遍' : ''}</div>
      </div>

      {piece.questions.map((q, qi) => (
        <div key={qi} className="card">
          <div className="q">{qi + 1}. {q.q}</div>
          {checked && <div className="muted small">{q.qZh}</div>}
          <div className="opts">
            {q.options.map((o, oi) => (
              <button key={oi} disabled={checked}
                className={`opt ${answers[qi] === oi ? 'sel' : ''} ${checked && oi === q.answer ? 'right' : ''} ${checked && answers[qi] === oi && oi !== q.answer ? 'wrong' : ''}`}
                onClick={() => setAnswers((prev) => prev.map((a, k) => (k === qi ? oi : a)))}>{o}</button>
            ))}
          </div>
        </div>
      ))}

      {!checked ? (
        <button className="btn primary full" disabled={answers.some((a) => a === null)} onClick={check}>检查答案</button>
      ) : (
        <>
          <div className="card center">
            <div className="big-score">{score} / {total}</div>
            <div className="row" style={{ justifyContent: 'center' }}>
              <button className="btn" onClick={retry}>重做</button>
              <Link className="btn" to="/listening">返回列表</Link>
            </div>
          </div>
          <h2>原文与翻译</h2>
          {piece.lines.map((l, i) => (
            <div key={i} className={`card row ${current === i ? 'playing' : ''}`}>
              <span className="tag">{l.who === 'f' ? '女' : '男'}</span>
              <div className="grow"><b>{l.nl}</b><div className="muted">{l.zh}</div></div>
              <button className="speak" aria-label="朗读" onClick={() => speak(l.nl, 0.85, l.who)}>🔊</button>
            </div>
          ))}
          <p className="muted small">想练习听写？回到听力列表点“去做听写”。</p>
        </>
      )}
    </div>
  )
}
