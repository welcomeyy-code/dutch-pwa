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

const FALLBACK_MODEL = 'gemini-flash-lite-latest'
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
const BUSY = new Set([429, 500, 503, 504])

async function callModel(model: string, key: string, base64Jpeg: string): Promise<Response> {
  return fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-goog-api-key': key },
    body: JSON.stringify({
      contents: [
        { role: 'user', parts: [{ inline_data: { mime_type: 'image/jpeg', data: base64Jpeg } }, { text: PROMPT }] },
      ],
      generationConfig: { responseMimeType: 'application/json', responseSchema: toGemini(SCAN_SCHEMA), temperature: 0.2 },
    }),
  })
}

/** 服务繁忙时：主模型重试 3 次（间隔 2s、4s），仍失败再试备用模型 2 次 */
async function callWithRetry(key: string, base64Jpeg: string): Promise<Response> {
  const main = settings.geminiModel
  const plan = [main, main, main, ...(main === FALLBACK_MODEL ? [] : [FALLBACK_MODEL, FALLBACK_MODEL])]
  let res!: Response
  for (let i = 0; i < plan.length; i++) {
    res = await callModel(plan[i], key, base64Jpeg)
    if (res.ok || !BUSY.has(res.status)) return res
    if (i < plan.length - 1) await sleep(Math.min(2000 * (i + 1), 6000))
  }
  return res
}

export async function scanWithGemini(base64Jpeg: string): Promise<ScanResult> {
  const key = settings.geminiKey
  if (!key) throw new Error('请先在「设置」中填写 Gemini API key')

  const res = await callWithRetry(key, base64Jpeg)
  if (!res.ok) {
    const t = await res.text().catch(() => '')
    if (BUSY.has(res.status))
      throw new Error(`Gemini 服务现在太忙（${res.status}），已自动重试仍失败。免费档高峰期常见，过几分钟再试，或在设置里切换到 Claude。`)
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
