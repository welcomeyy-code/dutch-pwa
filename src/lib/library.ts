import type { CEFR, POS, Word } from '../types'

interface CoreEntry {
  id: string
  nl: string
  article: 'de' | 'het' | null
  pos: string
  zh: string
  ipa: string
  level: string
  themes: string[]
  freq_rank: number
  plural_only: boolean
}

// NT2Lex 词类缩写 → 本项目 POS
const POS_MAP: Record<string, POS> = {
  N: 'noun', WW: 'verb', ADJ: 'adj', BW: 'adv', VZ: 'prep', VNW: 'pron',
  VG: 'conj', TW: 'num', LID: 'other', TSW: 'phrase',
}

let cache: Word[] | null = null

/** 词库 1608 词（A1+A2）。动态加载，单独成块，不进主包。 */
export async function loadCore(): Promise<Word[]> {
  if (cache) return cache
  const mod = await import('../data/core.json')
  const entries = (mod.default as { words: CoreEntry[] }).words
  const now = Date.now()
  cache = entries.map((e): Word => {
    const pos = POS_MAP[e.pos] ?? 'other'
    return {
      id: `${e.nl.toLowerCase()}-${pos}`,
      nl: e.nl,
      article: e.article ?? undefined,
      pos,
      zh: e.zh.split(/[；;]/).map((s) => s.trim()).filter(Boolean),
      ipa: e.ipa,
      examples: [],
      level: (e.level as CEFR) ?? 'A2',
      topic: e.themes[0] ?? '通用',
      themes: e.themes,
      freqRank: e.freq_rank,
      source: 'deck',
      extra: e.plural_only ? { plural: '仅复数' } : undefined,
      createdAt: now,
      updatedAt: now,
    }
  })
  return cache
}
