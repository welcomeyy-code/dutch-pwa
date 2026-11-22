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

/** 练习题。choice/fill 的 prompt 用 ___ 表示空格；order 的 prompt 是中文意思，answer 是完整荷兰语句子。 */
export type Exercise =
  | { type: 'choice'; prompt: string; options: string[]; answer: string; hint?: string; explainZh?: string }
  | { type: 'fill'; prompt: string; answer: string; accept?: string[]; hint?: string; explainZh?: string }
  | { type: 'order'; prompt: string; answer: string; alts?: string[]; explainZh?: string }

export interface GrammarLesson {
  id: string
  title: string
  level: CEFR
  /** 讲解正文，段落以换行分隔，“• ”开头为要点 */
  explanationZh: string
  examples: Example[]
  exercises: Exercise[]
}

export type PhonemeCategory = 'short' | 'long' | 'diphthong' | 'consonant' | 'rule'

export interface PhonemeUnit {
  id: string
  category: PhonemeCategory
  grapheme: string
  ipa: string
  summaryZh: string
  articulationZh: string
  /** 中文母语者常见错误 */
  cnMistakesZh?: string[]
  tipsZh: string[]
  /** 唇形：shape 圆唇/展唇/中性，open 0 闭 1 半开 2 大开 */
  lips?: { shape: 'round' | 'spread' | 'neutral'; open: 0 | 1 | 2 }
  /** 元音图上高亮的 IPA 符号；双元音再给 arrow=[起点, 终点] */
  vowel?: string[]
  arrow?: [string, string]
  /** 辅音表上高亮的 IPA 符号 */
  cons?: string[]
  examples: { nl: string; ipa: string; zh: string }[]
  minimalPairs: { nl: string; ipa: string; zh: string; contrast?: boolean }[]
}

export interface ListeningPiece {
  id: string
  kind: 'dialogue' | 'announcement'
  title: string // 中文场景名
  lines: { who: 'f' | 'm'; nl: string; zh: string }[]
  questions: { q: string; qZh: string; options: string[]; answer: number }[]
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
