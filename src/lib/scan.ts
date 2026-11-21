import { scanWithClaude, type ScanResult } from './claude'
import { scanWithGemini } from './gemini'
import { settings } from './settings'

export function hasScanKey(): boolean {
  return settings.provider === 'gemini' ? !!settings.geminiKey : !!settings.claudeKey
}

export function scanImage(base64Jpeg: string): Promise<ScanResult> {
  return settings.provider === 'gemini' ? scanWithGemini(base64Jpeg) : scanWithClaude(base64Jpeg)
}
