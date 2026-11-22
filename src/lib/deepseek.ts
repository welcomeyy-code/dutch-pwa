import type { ScanResult } from './claude'
import { PROMPT } from './claude'
import { settings } from './settings'
import type { CEFR, POS, ScanWord } from '../types'

// DeepSeek 使用 OpenAI 兼容接口。图片输入属于较新的功能，模型名可能变化：
// 主模型报“不支持图片/模型不存在”时，自动再试一次备用的视觉模型名。
const FALLBACK_MODELS = ['deepseek-v4-flash-vision-exp']
const BUSY = new Set([429, 500, 502, 503, 504])
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

const JSON_FORMAT = `只输出一个 JSON 对象（不要 Markdown 代码块），格式如下：
{
  "text": "识别出的荷兰语原文，保留换行；没有荷兰语则为空字符串",
  "words": [
    {
      "nl": "词典原形（名词单数、动词不定式）",
      "formInText": "原文中出现的形式",
      "article": "de 或 het（仅名词，其他为 null）",
      "pos": "noun|verb|adj|adv|prep|pron|conj|num|phrase|other 之一",
      "zh": ["简体中文释义，1-3 条"],
      "ipa": "标准荷兰语（荷兰）IPA，用 / / 包围",
      "level": "A1|A2|B1|B2 之一",
      "example": { "nl": "一个简单的荷兰语例句", "zh": "例句的中文翻译" }
    }
  ],
  "grammarZh": "用简体中文讲解原文句子的语法：语序（动词第二位、从句动词后置）、变位、可分动词、de/het、复数等"
}
words 去重，按原文顺序；不要遗漏名词、动词、形容词。`

const POS_SET = new Set<POS>(['noun', 'verb', 'adj', 'adv', 'prep', 'pron', 'conj', 'num', 'phrase', 'other'])
const LEVELS = new Set<CEFR>(['A1', 'A2', 'B1', 'B2'])

function parseJson(raw: string): Record<string, unknown> {
  const s = raw.trim().replace(/^```(?:json)?/i, '').replace(/```$/, '').trim()
  try { return JSON.parse(s) } catch { /* 尝试截取第一个 { 到最后一个 } */ }
  const a = s.indexOf('{'), b = s.lastIndexOf('}')
  if (a >= 0 && b > a) { try { return JSON.parse(s.slice(a, b + 1)) } catch { /* 落到下面的错误 */ } }
  throw new Error('返回结果不是有效 JSON，请重试')
}

/** 模型输出的字段可能不规范，这里统一成应用需要的结构 */
function normalize(o: Record<string, unknown>): ScanResult {
  const words = (Array.isArray(o.words) ? o.words : []).flatMap((w): ScanWord[] => {
    const x = w as Record<string, unknown>
    if (typeof x.nl !== 'string' || !x.nl.trim()) return []
    const zh = Array.isArray(x.zh) ? x.zh.map(String) : x.zh ? [String(x.zh)] : []
    const pos = POS_SET.has(x.pos as POS) ? (x.pos as POS) : 'other'
    const article = x.article === 'de' || x.article === 'het' ? x.article : undefined
    const level = LEVELS.has(x.level as CEFR) ? (x.level as CEFR) : 'A2'
    const ex = x.example as { nl?: unknown; zh?: unknown } | undefined
    return [{
      nl: x.nl.trim(), article, pos, zh, ipa: typeof x.ipa === 'string' ? x.ipa : '', level,
      formInText: typeof x.formInText === 'string' ? x.formInText : undefined,
      example: ex && typeof ex.nl === 'string' ? { nl: ex.nl, zh: typeof ex.zh === 'string' ? ex.zh : '' } : undefined,
    }]
  })
  return { text: typeof o.text === 'string' ? o.text : '', words, grammarZh: typeof o.grammarZh === 'string' ? o.grammarZh : '' }
}

function call(model: string, key: string, base64Jpeg: string) {
  return fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      max_tokens: 4096,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: `${PROMPT}\n\n${JSON_FORMAT}` },
            { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${base64Jpeg}` } },
          ],
        },
      ],
    }),
  })
}

export async function scanWithDeepseek(base64Jpeg: string): Promise<ScanResult> {
  const key = settings.deepseekKey
  if (!key) throw new Error('请先在「设置」中填写 DeepSeek API key')

  const models = [settings.deepseekModel, ...FALLBACK_MODELS.filter((m) => m !== settings.deepseekModel)]
  let lastError = ''
  for (let mi = 0; mi < models.length; mi++) {
    for (let attempt = 0; attempt < 3; attempt++) {
      const res = await call(models[mi], key, base64Jpeg)
      if (res.ok) {
        const data = await res.json()
        const content: string | undefined = data.choices?.[0]?.message?.content
        if (!content) throw new Error('DeepSeek 没有返回内容，请重试')
        return normalize(parseJson(content))
      }
      const body = await res.text().catch(() => '')
      lastError = `DeepSeek ${res.status}: ${body.slice(0, 300)}`
      if (res.status === 401) throw new Error('DeepSeek key 无效，请检查设置')
      if (res.status === 402) throw new Error('DeepSeek 账户余额不足，请先充值')
      if (BUSY.has(res.status)) { await sleep(2000 * (attempt + 1)); continue }
      break // 400/404：多半是模型名或不支持图片，换下一个模型名
    }
  }
  throw new Error(`${lastError}\n如果提示不支持图片或模型不存在，请在设置里把 DeepSeek 模型改成官方文档里的视觉模型名，或改用 Gemini / Claude。`)
}
