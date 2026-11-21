import type { BackupData } from '../types'

type Rec = { updatedAt: number }

function mergeDict<T extends Rec>(a: Record<string, T>, b: Record<string, T>): Record<string, T> {
  const out: Record<string, T> = { ...a }
  for (const [k, v] of Object.entries(b)) {
    if (!out[k] || (v.updatedAt ?? 0) > (out[k].updatedAt ?? 0)) out[k] = v
  }
  return out
}

/** 逐条按 updatedAt 取较新者；删除用墓碑，墓碑晚于记录则记录被删除 */
export function mergeBackups(local: BackupData, remote: BackupData): BackupData {
  const tombstones: Record<string, number> = { ...local.tombstones }
  for (const [k, t] of Object.entries(remote.tombstones ?? {})) tombstones[k] = Math.max(tombstones[k] ?? 0, t)

  const words = mergeDict(local.words, remote.words ?? {})
  const reviews = mergeDict(local.reviews, remote.reviews ?? {})
  const scans = mergeDict(local.scans, remote.scans ?? {})

  for (const [id, t] of Object.entries(tombstones)) {
    if (words[id] && words[id].updatedAt < t) {
      delete words[id]
      delete reviews[id]
    } else if (words[id]) {
      delete tombstones[id] // 删除后又重新加入
    }
  }
  return { version: 1, exportedAt: Date.now(), words, reviews, scans, tombstones }
}
