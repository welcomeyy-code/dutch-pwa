import type { POS, Word } from '../types'

export const displayWord = (w: Pick<Word, 'nl' | 'article'>) => (w.article ? `${w.article} ${w.nl}` : w.nl)
export const wordId = (nl: string, pos: string) => `${nl.trim().toLowerCase()}-${pos}`

export const POS_ZH: Record<POS, string> = {
  noun: '名词', verb: '动词', adj: '形容词', adv: '副词', prep: '介词', pron: '代词',
  conj: '连词', num: '数词', phrase: '短语/感叹', other: '其他',
}
