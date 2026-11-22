import { LESSONS } from './grammar'
import { LISTENING } from './listening'

export interface DictationItem { key: string; text: string; zh: string; who: 'f' | 'm' }

// 简单的字符串哈希，用于生成稳定的复习键（只依赖句子内容）
function hash(s: string): string {
  let h = 5381
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0
  return (h >>> 0).toString(36)
}

/** 听写题库：听力对话里的句子 + 语法课例句，只保留 3 个词以上、较短的完整句子 */
export function buildDictationPool(): DictationItem[] {
  const seen = new Set<string>()
  const out: DictationItem[] = []
  const add = (text: string, zh: string, who: 'f' | 'm') => {
    const words = text.trim().split(/\s+/)
    if (words.length < 3 || words.length > 14 || seen.has(text)) return
    seen.add(text)
    out.push({ key: `dc:${hash(text)}`, text, zh, who })
  }
  for (const p of LISTENING) for (const l of p.lines) add(l.nl, l.zh, l.who)
  for (const l of LESSONS) for (const e of l.examples) add(e.nl, e.zh, 'f')
  return out
}
