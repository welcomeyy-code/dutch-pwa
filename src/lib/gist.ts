import { exportAll, isBackup, replaceAll } from '../db/db'
import { mergeBackups } from './merge'
import { settings } from './settings'
import type { BackupData } from '../types'

const API = 'https://api.github.com'
const FILE = 'dutch-backup.json'

function headers() {
  return {
    Authorization: `Bearer ${settings.gistToken}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  }
}

async function check(res: Response) {
  if (!res.ok) {
    const t = await res.text().catch(() => '')
    throw new Error(`GitHub ${res.status}: ${t.slice(0, 200)}`)
  }
  return res
}

async function fetchRemote(id: string): Promise<BackupData | null> {
  const res = await check(await fetch(`${API}/gists/${id}`, { headers: headers() }))
  const g = await res.json()
  const f = g.files?.[FILE]
  if (!f) return null
  let content: string = f.content
  if (f.truncated && f.raw_url) content = await (await fetch(f.raw_url)).text()
  const data = JSON.parse(content)
  return isBackup(data) ? data : null
}

async function writeRemote(data: BackupData) {
  const body = JSON.stringify({ files: { [FILE]: { content: JSON.stringify(data) } } })
  if (settings.gistId) {
    await check(await fetch(`${API}/gists/${settings.gistId}`, { method: 'PATCH', headers: headers(), body }))
  } else {
    const res = await check(
      await fetch(`${API}/gists`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({ description: 'Dutch PWA backup', public: false, files: { [FILE]: { content: JSON.stringify(data) } } }),
      }),
    )
    settings.gistId = (await res.json()).id
  }
}

/** 上传：先与远端合并再写入，避免覆盖其他设备的进度 */
export async function pushGist(): Promise<string> {
  if (!settings.gistToken) throw new Error('请先填写 GitHub token')
  let data = await exportAll()
  if (settings.gistId) {
    const remote = await fetchRemote(settings.gistId)
    if (remote) data = mergeBackups(data, remote)
    await replaceAll(data)
  }
  await writeRemote(data)
  settings.lastSync = Date.now()
  return `已上传：${Object.keys(data.words).length} 词`
}

/** 拉取：与本地合并（逐条取较新） */
export async function pullGist(): Promise<string> {
  if (!settings.gistToken) throw new Error('请先填写 GitHub token')
  if (!settings.gistId) throw new Error('还没有 Gist，请先在这台设备上传一次，或填入 Gist ID')
  const remote = await fetchRemote(settings.gistId)
  if (!remote) throw new Error('Gist 中没有找到有效备份')
  const merged = mergeBackups(await exportAll(), remote)
  await replaceAll(merged)
  settings.lastSync = Date.now()
  return `已合并：现有 ${Object.keys(merged.words).length} 词`
}
