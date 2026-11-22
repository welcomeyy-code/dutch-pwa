import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { LESSONS } from '../data/grammar'
import ExerciseRunner from '../components/ExerciseRunner'
import SpeakButton from '../components/SpeakButton'

export default function GrammarLesson() {
  const { id } = useParams()
  const nav = useNavigate()
  const [practice, setPractice] = useState(false)
  const idx = LESSONS.findIndex((l) => l.id === id)
  const lesson = LESSONS[idx]
  if (!lesson) return <div><p>找不到这一课。</p><Link to="/grammar">返回语法课</Link></div>

  if (practice)
    return (
      <div>
        <h2>{lesson.title}：练习</h2>
        <ExerciseRunner
          items={lesson.exercises.map((exercise, n) => ({ key: `ex:${lesson.id}:${n}`, exercise }))}
          onDone={() => { setPractice(false); nav('/grammar') }}
        />
      </div>
    )

  const next = LESSONS[idx + 1]
  return (
    <div>
      <p><Link to="/grammar">‹ 语法课</Link></p>
      <h1>{idx + 1}. {lesson.title}</h1>
      <span className="tag">{lesson.level}</span>
      <div className="card pre explain">{lesson.explanationZh}</div>

      <h2>例句（点喇叭听）</h2>
      {lesson.examples.map((e) => (
        <div key={e.nl} className="card row">
          <SpeakButton text={e.nl} />
          <div className="grow"><b>{e.nl}</b><div className="muted">{e.zh}</div></div>
        </div>
      ))}

      <button className="btn primary full" onClick={() => setPractice(true)}>开始练习（{lesson.exercises.length} 题）</button>
      {next && <Link className="btn full" style={{ marginTop: 8 }} to={`/grammar/${next.id}`}>下一课：{next.title}</Link>}
    </div>
  )
}
