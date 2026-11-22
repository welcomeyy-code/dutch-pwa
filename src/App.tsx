import { useEffect, useState } from 'react'
import { Link, Route, Routes, useLocation } from 'react-router-dom'
import { ensureSeed } from './db/db'
import Home from './pages/Home'
import Review from './pages/Review'
import Deck from './pages/Deck'
import Scan from './pages/Scan'
import Library from './pages/Library'
import Pronunciation from './pages/Pronunciation'
import Settings from './pages/Settings'
import Practice from './pages/Practice'
import GrammarList from './pages/GrammarList'
import GrammarLesson from './pages/GrammarLesson'
import GrammarReview from './pages/GrammarReview'

// 每个标签对应的路径前缀；“练习”下挂语法、发音、拍照等
const TABS: { to: string; label: string; icon: string; match: string[] }[] = [
  { to: '/', label: '首页', icon: '🏠', match: [] },
  { to: '/review', label: '复习', icon: '🔁', match: ['/review'] },
  { to: '/practice', label: '练习', icon: '✏️', match: ['/practice', '/grammar', '/pronounce', '/scan'] },
  { to: '/deck', label: '卡组', icon: '📚', match: ['/deck', '/library'] },
  { to: '/settings', label: '设置', icon: '⚙️', match: ['/settings'] },
]

export default function App() {
  const [ready, setReady] = useState(false)
  const { pathname } = useLocation()
  useEffect(() => {
    ensureSeed().finally(() => setReady(true))
  }, [])

  return (
    <div className="app">
      <main className="main">
        {ready ? (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/review" element={<Review />} />
            <Route path="/deck" element={<Deck />} />
            <Route path="/library" element={<Library />} />
            <Route path="/practice" element={<Practice />} />
            <Route path="/grammar" element={<GrammarList />} />
            <Route path="/grammar/review" element={<GrammarReview />} />
            <Route path="/grammar/:id" element={<GrammarLesson />} />
            <Route path="/scan" element={<Scan />} />
            <Route path="/pronounce" element={<Pronunciation />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        ) : (
          <p className="muted">加载中…</p>
        )}
      </main>
      <nav className="tabbar">
        {TABS.map((t) => {
          const active = t.to === '/' ? pathname === '/' : t.match.some((m) => pathname === m || pathname.startsWith(m + '/'))
          return (
            <Link key={t.to} to={t.to} className={active ? 'tab active' : 'tab'}>
              <span className="ti">{t.icon}</span>
              <span>{t.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
