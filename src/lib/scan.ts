import { scanWithClaude, type ScanResult } from './claude'
import { scanWithDeepseek } from './deepseek'
import { scanWithGemini } from './gemini'
import { settings } from './settings'

export function hasScanKey(): boolean {
  switch (settings.provider) {
    case 'gemini': return !!settings.geminiKey
    case 'deepseek': return !!settings.deepseekKey
    default: return !!settings.claudeKey
  }
}

export function scanImage(base64Jpeg: string): Promise<ScanResult> {
  switch (settings.provider) {
    case 'gemini': return scanWithGemini(base64Jpeg)
    case 'deepseek': return scanWithDeepseek(base64Jpeg)
    default: return scanWithClaude(base64Jpeg)
  }
}
