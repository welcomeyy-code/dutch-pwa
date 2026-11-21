export type CEFR = 'A1' | 'A2' | 'B1' | 'B2'
export type POS =
  | 'noun' | 'verb' | 'adj' | 'adv' | 'prep' | 'pron' | 'conj' | 'num' | 'phrase' | 'other'

export interface Example { nl: string; zh: string }

/** 词条。id = `${nl小写}-${pos}`，用于去重 */
export interface Word {
  id: string
  nl: string
  article?: 'de' | 'het'
  pos: POS
  zh: string[]
  ipa: string
  examples: Example[]
  level: CEFR
  topic: string
  source: 'deck' | 'photo'
  extra?: { plural?: string; pastTense?: string; separable?: boolean }
  themes?: string[] // 词库主题，如 werk / eten / gemeente
  freqRank?: number // 词库频率排名，越小越常用
  createdAt: number
  updatedAt: number
}

/** SRS 复习记录，一词一条 */
export interface ReviewRecord {
  wordId: string
  ease: number
  interval: number // 天
  reps: number
  lapses: number
  due: number // 时间戳 ms
  lastReview?: number
  updatedAt: number
}

export interface GrammarLesson {
  id: string
  title: string
  level: CEFR
  explanationZh: string
  examples: Example[]
  exercises: {
    type: 'choice' | 'fill' | 'order'
    prompt: string
    answer: string
    options?: string[]
  }[]
}

export interface PhonemeUnit {
  id: string
  grapheme: string
  ipa: string
  summaryZh: string
  articulationZh: string
  tipsZh: string[]
  minimalPairs: { nl: string; ipa: string; zh: string; contrast?: boolean }[]
}

export type ScanWord = Pick<Word, 'nl' | 'article' | 'pos' | 'zh' | 'ipa' | 'level'> & {
  formInText?: string
  example?: Example
}

export interface PhotoScan {
  id: string
  createdAt: number
  updatedAt: number
  text: string
  words: ScanWord[]
  grammarZh: string
}

export interface BackupData {
  version: 1
  exportedAt: number
  words: Record<string, Word>
  reviews: Record<string, ReviewRecord>
  scans: Record<string, PhotoScan>
  tombstones: Record<string, number>
}
