import type { PhonemeUnit } from '../types'

/* ───────── 元音舌位图（IPA 梯形）───────── */
// f：0=最前 1=最后；h：0=最闭（舌位高）1=最开（舌位低）
const VOWELS: Record<string, [number, number]> = {
  i: [0, 0], y: [0.1, 0], u: [1, 0],
  ɪ: [0.3, 0.17], ʏ: [0.4, 0.17],
  e: [0.1, 0.33], ø: [0.2, 0.33], o: [1, 0.33],
  ə: [0.6, 0.5],
  ɛ: [0.2, 0.66], œ: [0.3, 0.66], ʌ: [0.8, 0.66], ɔ: [1, 0.66],
  a: [0.15, 1], ɑ: [1, 1],
}
const px = (f: number, h: number) => {
  const left = 20 + 90 * h
  return { x: left + f * (290 - left), y: 20 + 150 * h }
}

export function VowelChart({ highlight, arrow }: { highlight: string[]; arrow?: [string, string] }) {
  const a = arrow && VOWELS[arrow[0]] && VOWELS[arrow[1]] ? [px(...VOWELS[arrow[0]]), px(...VOWELS[arrow[1]])] : null
  return (
    <svg viewBox="0 0 330 195" className="diagram" role="img" aria-label="元音舌位图：左边舌位靠前，上面舌位高">
      <defs>
        <marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="var(--accent)" />
        </marker>
      </defs>
      <polygon points="20,20 290,20 290,170 110,170" fill="none" stroke="var(--line)" strokeWidth="2" />
      {[1, 2].map((i) => {
        const h = i / 3
        const l = px(0, h).x
        return <line key={i} x1={l} y1={20 + 150 * h} x2={290} y2={20 + 150 * h} stroke="var(--line)" strokeDasharray="3 4" />
      })}
      <line x1="155" y1="20" x2="200" y2="170" stroke="var(--line)" strokeDasharray="3 4" />
      <text x="20" y="12" className="dgm-label">前</text>
      <text x="282" y="12" className="dgm-label">后</text>
      <text x="304" y="40" className="dgm-label">高</text>
      <text x="304" y="168" className="dgm-label">低</text>
      {Object.entries(VOWELS).map(([sym, [f, h]]) => {
        const p = px(f, h)
        const on = highlight.includes(sym)
        return (
          <g key={sym}>
            <circle cx={p.x} cy={p.y} r={on ? 6 : 3} fill={on ? 'var(--accent)' : 'var(--muted)'} opacity={on ? 1 : 0.55} />
            {f >= 0.9 ? (
              <text x={p.x - 10} y={p.y + 5} textAnchor="end" className={on ? 'dgm-sym on' : 'dgm-sym'}>{sym}</text>
            ) : (
              <text x={p.x + 9} y={p.y + 5} className={on ? 'dgm-sym on' : 'dgm-sym'}>{sym}</text>
            )}
          </g>
        )
      })}
      {a && <line x1={a[0].x} y1={a[0].y} x2={a[1].x} y2={a[1].y} stroke="var(--accent)" strokeWidth="2.5" markerEnd="url(#arr)" />}
    </svg>
  )
}

/* ───────── 辅音发音部位表 ───────── */
const PLACES = ['双唇', '唇齿', '齿龈', '龈后', '硬腭', '软腭', '小舌', '声门']
const MANNERS: [string, string[][]][] = [
  ['塞音', [['p', 'b'], [], ['t', 'd'], [], ['c'], ['k'], [], []]],
  ['鼻音', [['m'], [], ['n'], [], [], ['ŋ'], [], []]],
  ['擦音', [[], ['f', 'v'], ['s', 'z'], ['ʃ', 'ʒ'], [], ['x', 'ɣ'], [], ['ɦ']]],
  ['近音', [[], ['ʋ'], [], [], ['j'], [], [], []]],
  ['边音', [[], [], ['l'], [], [], [], [], []]],
  ['颤音', [[], [], ['r'], [], [], [], ['ʀ'], []]],
]

export function ConsonantChart({ highlight }: { highlight: string[] }) {
  return (
    <div className="cons-wrap">
      <table className="cons" aria-label="辅音发音部位表（左边靠嘴唇，右边靠喉咙）">
        <thead>
          <tr><th />{PLACES.map((p) => <th key={p}>{p}</th>)}</tr>
        </thead>
        <tbody>
          {MANNERS.map(([m, cells]) => (
            <tr key={m}>
              <th>{m}</th>
              {cells.map((syms, i) => (
                <td key={i}>
                  {syms.map((s) => (
                    <span key={s} className={highlight.includes(s) ? 'cs on' : 'cs'}>{s}</span>
                  ))}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="muted small">每格里成对的符号：左边清音（声带不震），右边浊音（声带震动）。</p>
    </div>
  )
}

/* ───────── 唇形图 ───────── */
export function LipIcon({ lips }: { lips: NonNullable<PhonemeUnit['lips']> }) {
  const { shape, open } = lips
  let rx: number, ry: number
  if (shape === 'round') { rx = 9 + open * 4; ry = 9 + open * 5 }
  else if (shape === 'spread') { rx = 32; ry = 3 + open * 7 }
  else { rx = 22; ry = 6 + open * 8 }
  const label = { round: '圆唇', spread: '展唇', neutral: '自然' }[shape]
  const jaw = ['闭', '半开', '大开'][open]
  return (
    <div className="lip">
      <svg viewBox="0 0 120 80" role="img" aria-label={`唇形：${label}，开口${jaw}`}>
        <ellipse cx="60" cy="40" rx={rx + 9} ry={ry + 8} fill="var(--accent)" opacity="0.85" />
        <ellipse cx="60" cy="40" rx={rx} ry={ry} fill="var(--text)" opacity="0.88" />
        {open > 0 && <ellipse cx="60" cy={40 + ry * 0.45} rx={rx * 0.6} ry={ry * 0.4} fill="var(--accent)" opacity="0.35" />}
      </svg>
      <div className="muted small">{label} · 开口{jaw}</div>
    </div>
  )
}
