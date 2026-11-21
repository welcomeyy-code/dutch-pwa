import { get, set } from 'idb-keyval'
import type { BackupData, PhotoScan, ReviewRecord, Word } from '../types'
import { SEED_WORDS } from '../data/a1-words'

type Dict<T> = Record<string, T>
const KEYS = { words: 'words', reviews: 'reviews', scans: 'scans', tomb: 'tombstones', seeded: 'seeded-v1' }

async function load<T>(k: string): Promise<Dict<T>> {
  return ((await get(k)) as Dict<T> | undefined) ?? {}
}

/** 首次启动导入种子词（updatedAt=0，多设备一致，不会覆盖用户改动） */
export async function ensureSeed() {
  if (await get(KEYS.seeded)) return
  const words = await load<Word>(KEYS.words)
  for (const w of SEED_WORDS) if (!words[w.id]) words[w.id] = w
  await set(KEYS.words, words)
  await set(KEYS.seeded, true)
}

export const getWords = () => load<Word>(KEYS.words)
export const getReviews = () => load<ReviewRecord>(KEYS.reviews)
export const getScans = () => load<PhotoScan>(KEYS.scans)
const getTomb = () => load<number>(KEYS.tomb)

export async function addWords(list: Word[]): Promise<number> {
  const words = await getWords()
  const tomb = await getTomb()
  let n = 0
  for (const w of list) {
    if (words[w.id]) continue
    words[w.id] = w
    delete tomb[w.id]
    n++
  }
  await set(KEYS.words, words)
  await set(KEYS.tomb, tomb)
  return n
}

export async function deleteWord(id: string) {
  const [words, reviews, tomb] = await Promise.all([getWords(), getReviews(), getTomb()])
  delete words[id]
  delete reviews[id]
  tomb[id] = Date.now()
  await Promise.all([set(KEYS.words, words), set(KEYS.reviews, reviews), set(KEYS.tomb, tomb)])
}

export async function saveReview(r: ReviewRecord) {
  const reviews = await getReviews()
  reviews[r.wordId] = r
  await set(KEYS.reviews, reviews)
}

export async function addScan(s: PhotoScan) {
  const scans = await getScans()
  scans[s.id] = s
  await set(KEYS.scans, scans)
}

export async function exportAll(): Promise<BackupData> {
  const [words, reviews, scans, tombstones] = await Promise.all([getWords(), getReviews(), getScans(), getTomb()])
  return { version: 1, exportedAt: Date.now(), words, reviews, scans, tombstones }
}

export async function replaceAll(d: BackupData) {
  await Promise.all([
    set(KEYS.words, d.words ?? {}),
    set(KEYS.reviews, d.reviews ?? {}),
    set(KEYS.scans, d.scans ?? {}),
    set(KEYS.tomb, d.tombstones ?? {}),
    set(KEYS.seeded, true),
  ])
}

export function isBackup(x: unknown): x is BackupData {
  const d = x as BackupData
  return !!d && d.version === 1 && typeof d.words === 'object' && typeof d.reviews === 'object'
}
