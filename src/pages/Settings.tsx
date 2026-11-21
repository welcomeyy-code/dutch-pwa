import { useRef, useState } from 'react'
import { exportAll, isBackup, replaceAll } from '../db/db'
import { pullGist, pushGist } from '../lib/gist'
import { mergeBackups } from '../lib/merge'
import { DEFAULT_MODEL, settings } from '../lib/settings'

export default function Settings() {
  const [key, setKey] = useState(settings.claudeKey)
  const [model, setModel] = useState(settings.model)
  const [token, setToken] = useState(settings.gistToken)
  const [gistId, setGistId] = useState(settings.gistId)
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const run = async (f: () => Promise<string>) => {
    setBusy(true); setMsg('')
    try { setMsg(await f()) } catch (e) { setMsg('❌ ' + (e instanceof Error ? e.message : String(e))) } finally { setBusy(false) }
  }
  const saveAll = () => {
    settings.claudeKey = key; settings.model = model || DEFAULT_MODEL
    settings.gistToken = token; settings.gistId = gistId
    setMsg('✅ 已保存')
  }

  const exportFile = () => run(async () => {
    const blob = new Blob([JSON.stringify(await exportAll())], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `dutch-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    return '已导出'
  })
  const importFile = (f?: File) => f && run(async () => {
    const data = JSON.parse(await f.text())
    if (!isBackup(data)) throw new Error('不是有效的备份文件')
    await replaceAll(mergeBackups(await exportAll(), data))
    return '已导入并与本地合并'
  })

  return (
    <div>
      <h1>设置</h1>

      <h2>Claude API</h2>
      <input className="input" type="password" placeholder="sk-ant-…" autoComplete="off" value={key} onChange={(e) => setKey(e.target.value)} />
      <input className="input" placeholder={`模型（默认 ${DEFAULT_MODEL}）`} value={model} onChange={(e) => setModel(e.target.value)} />
      <p className="muted">key 只保存在本机浏览器（localStorage），请求直接发给 Anthropic。只在自己的设备上使用，不要把它写进代码或仓库。</p>

      <h2>GitHub Gist 同步（可选）</h2>
      <input className="input" type="password" placeholder="GitHub token（经典 token，勾选 gist 权限）" autoComplete="off" value={token} onChange={(e) => setToken(e.target.value)} />
      <input className="input" placeholder="Gist ID（首次上传会自动生成；新设备可手动填入）" value={gistId} onChange={(e) => setGistId(e.target.value)} />
      <div className="row">
        <button className="btn grow" disabled={busy} onClick={() => { saveAll(); run(pushGist) }}>⬆️ 上传</button>
        <button className="btn grow" disabled={busy} onClick={() => { saveAll(); run(async () => { const r = await pullGist(); return r }) }}>⬇️ 拉取</button>
      </div>
      <p className="muted">
        上次同步：{settings.lastSync ? new Date(settings.lastSync).toLocaleString() : '从未'}。同步是手动的，并按记录逐条合并（取较新的），不会整体覆盖。Gist 是私密链接，不是加密，里面只有学习进度。
      </p>

      <button className="btn primary" onClick={saveAll}>保存设置</button>
      {msg && <div className="card">{msg}</div>}

      <h2>关于词库</h2>
      <p className="muted">
        词库 A1+A2 核心词基于 NT2Lex（Tack et al. 2018，CC BY-NC-SA 4.0），仅限个人、非商业使用；音标由 eSpeak NG 生成，部分经手工校对。
      </p>

      <h2>本地备份</h2>
      <div className="row">
        <button className="btn grow" disabled={busy} onClick={exportFile}>导出 JSON</button>
        <button className="btn grow" disabled={busy} onClick={() => fileRef.current?.click()}>导入 JSON</button>
        <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={(e) => { importFile(e.target.files?.[0]); e.target.value = '' }} />
      </div>
      <p className="muted">iOS 可能清理长期不用的网站数据，建议定期导出或上传 Gist。</p>
    </div>
  )
}
