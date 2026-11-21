import type { ReviewRecord } from '../types'

/** 0=重来 1=困难 2=记得 3=简单 */
export type Grade = 0 | 1 | 2 | 3
const DAY = 86400000

export function schedule(wordId: string, prev: ReviewRecord | undefined, grade: Grade, now = Date.now()): ReviewRecord {
  let ease = prev?.ease ?? 2.5
  let interval = prev?.interval ?? 0
  let reps = prev?.reps ?? 0
  let lapses = prev?.lapses ?? 0
  let due: number

  if (grade === 0) {
    lapses += 1
    reps = 0
    interval = 0
    ease = Math.max(1.3, ease - 0.2)
    due = now + 10 * 60000
  } else {
    if (grade === 1) {
      ease = Math.max(1.3, ease - 0.15)
      interval = reps === 0 ? 1 : Math.max(1, Math.round(interval * 1.2))
    } else if (grade === 2) {
      interval = reps === 0 ? 1 : reps === 1 ? 3 : Math.round(interval * ease)
    } else {
      ease += 0.15
      interval = reps === 0 ? 3 : Math.max(4, Math.round(Math.max(interval, 1) * ease * 1.3))
    }
    reps += 1
    due = now + interval * DAY
  }
  return { wordId, ease, interval, reps, lapses, due, lastReview: now, updatedAt: now }
}

/** 按钮上显示的预估间隔 */
export function previewLabel(prev: ReviewRecord | undefined, grade: Grade): string {
  const r = schedule('', prev, grade, 0)
  if (grade === 0) return '10分钟'
  return r.interval + '天'
}
