import { settings } from './settings'
import type { PhotoScan, ScanWord } from '../types'

const TOOL = {
  name: 'report_scan',
  description: '返回图片中荷兰语文字的解读结果',
  input_schema: {
    type: 'object',
    properties: {
      text: { type: 'string', description: '图片中识别出的荷兰语原文，保留换行' },
      words: {
        type: 'array',
        description: '原文中值得学习的词（去重，按原文顺序，跳过过于简单的虚词可保留 de/het/een 以外的）',
        items: {
          type: 'object',
          properties: {
            nl: { type: 'string', description: '词典原形（名词单数、动词不定式）' },
            formInText: { type: 'string', description: '原文中出现的形式' },
            article: { type: 'string', enum: ['de', 'het'], description: '仅名词填写' },
            pos: { type: 'string', enum: ['noun', 'verb', 'adj', 'adv', 'prep', 'pron', 'conj', 'num', 'phrase', 'other'] },
            zh: { type: 'array', items: { type: 'string' }, description: '简体中文释义，1-3 条' },
            ipa: { type: 'string', description: '标准荷兰语（荷兰）IPA，用 / / 包围' },
            level: { type: 'string', enum: ['A1', 'A2', 'B1', 'B2'] },
            example: {
              type: 'object',
              properties: { nl: { type: 'string' }, zh: { type: 'string' } },
              required: ['nl', 'zh'],
            },
          },
          required: ['nl', 'pos', 'zh', 'ipa', 'level'],
        },
      },
      grammarZh: {
        type: 'string',
        description: '用简体中文讲解原文句子的语法：语序（如动词第二位、从句动词后置）、变位、可分动词、de/het、复数等',
      },
    },
    required: ['text', 'words', 'grammarZh'],
  },
}

export const SCAN_SCHEMA = TOOL.input_schema

export const PROMPT = `这是一张包含荷兰语文字的图片（可能是标牌、信件、菜单、课本等）。请读取其中的荷兰语，并调用 report_scan 返回：
1. text：识别出的原文；
2. words：逐词释义（词典原形、de/het、词性、简体中文、IPA、CEFR 级别），面向 A1–A2 阶段的中文学习者；
3. grammarZh：用简体中文讲解句子的语法要点。
图片里没有荷兰语时，text 返回空字符串，words 返回空数组。`

export type ScanResult = Omit<PhotoScan, 'id' | 'createdAt' | 'updatedAt'>

export async function scanWithClaude(base64Jpeg: string): Promise<ScanResult> {
  const key = settings.claudeKey
  if (!key) throw new Error('请先在「设置」中填写 Claude API key')

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: settings.model,
      max_tokens: 4096,
      tools: [TOOL],
      tool_choice: { type: 'tool', name: TOOL.name },
      messages: [
        {
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: base64Jpeg } },
            { type: 'text', text: PROMPT },
          ],
        },
      ],
    }),
  })
  if (!res.ok) {
    const t = await res.text().catch(() => '')
    throw new Error(`Claude API ${res.status}: ${t.slice(0, 300)}`)
  }
  const data = await res.json()
  const block = (data.content as { type: string; input?: unknown }[]).find((b) => b.type === 'tool_use')
  if (!block?.input) throw new Error('返回结果格式不正确，请重试')
  const input = block.input as { text?: string; words?: ScanWord[]; grammarZh?: string }
  return {
    text: input.text ?? '',
    words: Array.isArray(input.words) ? input.words : [],
    grammarZh: input.grammarZh ?? '',
  }
}
