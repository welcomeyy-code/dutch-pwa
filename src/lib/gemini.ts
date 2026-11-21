import { PROMPT, SCAN_SCHEMA, type ScanResult } from './claude'
import { settings } from './settings'
import type { ScanWord } from '../types'

/** 把 JSON Schema 转成 Gemini responseSchema（类型名大写，去掉不支持的字段） */
function toGemini(s: unknown): unknown {
  if (Array.isArray(s)) return s.map(toGemini)
  if (s && typeof s === 'object') {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(s as Record<string, unknown>)) {
      if (k === 'type' && typeof v === 'string') out[k] = v.toUpperCase()
      else if (k === 'properties' && v && typeof v === 'object')
        out[k] = Object.fromEntries(Object.entries(v).map(([pk, pv]) => [pk, toGemini(pv)]))
      else out[k] = toGemini(v)
    }
    return out
  }
  return s
}

export async function scanWithGemini(base64Jpeg: string): Promise<ScanResult> {
  const key = settings.geminiKey
  if (!key) throw new Error('请先在「设置」中填写 Gemini API key')

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(settings.geminiModel)}:generateContent`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-goog-api-key': key },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ inline_data: { mime_type: 'image/jpeg', data: base64Jpeg } }, { text: PROMPT }],
          },
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: toGemini(SCAN_SCHEMA),
          temperature: 0.2,
        },
      }),
    },
  )
  if (!res.ok) {
    const t = await res.text().catch(() => '')
    throw new Error(`Gemini API ${res.status}: ${t.slice(0, 300)}`)
  }
  const data = await res.json()
  const text: string | undefined = data.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text ?? '').join('')
  if (!text) {
    const why = data.promptFeedback?.blockReason ?? data.candidates?.[0]?.finishReason ?? '未知原因'
    throw new Error(`Gemini 没有返回内容（${why}），请换一张图或重试`)
  }
  let input: { text?: string; words?: ScanWord[]; grammarZh?: string }
  try { input = JSON.parse(text) } catch { throw new Error('返回结果不是有效 JSON，请重试') }
  return {
    text: input.text ?? '',
    words: Array.isArray(input.words) ? input.words : [],
    grammarZh: input.grammarZh ?? '',
  }
}
