const K = {
  claudeKey: 'dutch.claudeKey',
  model: 'dutch.model',
  gistToken: 'dutch.gistToken',
  gistId: 'dutch.gistId',
  lastSync: 'dutch.lastSync',
  voiceURI: 'dutch.voiceURI',
  provider: 'dutch.provider',
  geminiKey: 'dutch.geminiKey',
  geminiModel: 'dutch.geminiModel',
}

function get(k: string): string {
  try { return localStorage.getItem(k) ?? '' } catch { return '' }
}
function set(k: string, v: string) {
  try { v ? localStorage.setItem(k, v) : localStorage.removeItem(k) } catch { /* 隐私模式 */ }
}

export const DEFAULT_MODEL = 'claude-sonnet-5-5'
export const DEFAULT_GEMINI_MODEL = 'gemini-flash-latest'

export const settings = {
  get claudeKey() { return get(K.claudeKey) },
  set claudeKey(v: string) { set(K.claudeKey, v.trim()) },
  get model() { return get(K.model) || DEFAULT_MODEL },
  set model(v: string) { set(K.model, v.trim()) },
  get gistToken() { return get(K.gistToken) },
  set gistToken(v: string) { set(K.gistToken, v.trim()) },
  get gistId() { return get(K.gistId) },
  set gistId(v: string) { set(K.gistId, v.trim()) },
  get provider(): 'claude' | 'gemini' { return get(K.provider) === 'claude' ? 'claude' : 'gemini' },
  set provider(v: 'claude' | 'gemini') { set(K.provider, v) },
  get geminiKey() { return get(K.geminiKey) },
  set geminiKey(v: string) { set(K.geminiKey, v.trim()) },
  get geminiModel() { return get(K.geminiModel) || DEFAULT_GEMINI_MODEL },
  set geminiModel(v: string) { set(K.geminiModel, v.trim()) },
  get voiceURI() { return get(K.voiceURI) },
  set voiceURI(v: string) { set(K.voiceURI, v) },
  get lastSync() { return Number(get(K.lastSync)) || 0 },
  set lastSync(v: number) { set(K.lastSync, String(v)) },
}
