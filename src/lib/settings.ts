const K = {
  claudeKey: 'dutch.claudeKey',
  model: 'dutch.model',
  gistToken: 'dutch.gistToken',
  gistId: 'dutch.gistId',
  lastSync: 'dutch.lastSync',
}

function get(k: string): string {
  try { return localStorage.getItem(k) ?? '' } catch { return '' }
}
function set(k: string, v: string) {
  try { v ? localStorage.setItem(k, v) : localStorage.removeItem(k) } catch { /* 隐私模式 */ }
}

export const DEFAULT_MODEL = 'claude-sonnet-5-5'

export const settings = {
  get claudeKey() { return get(K.claudeKey) },
  set claudeKey(v: string) { set(K.claudeKey, v.trim()) },
  get model() { return get(K.model) || DEFAULT_MODEL },
  set model(v: string) { set(K.model, v.trim()) },
  get gistToken() { return get(K.gistToken) },
  set gistToken(v: string) { set(K.gistToken, v.trim()) },
  get gistId() { return get(K.gistId) },
  set gistId(v: string) { set(K.gistId, v.trim()) },
  get lastSync() { return Number(get(K.lastSync)) || 0 },
  set lastSync(v: number) { set(K.lastSync, String(v)) },
}
