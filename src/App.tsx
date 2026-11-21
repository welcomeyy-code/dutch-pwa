import { useEffect, useState } from 'react'
import { NavLink, Route, Routes } from 'react-router-dom'
import { ensureSeed } from './db/db'
import Home from './pages/Home'
import Review from './pages/Review'
import Deck from './pages/Deck'
import Scan from './pages/Scan'
import Library from './pages/Library'
import Pronunciation from './pages/Pronunciation'
import Settings from './pages/Settings'

const TABS = [
  ['/', '首页', '🏠'],
  ['/review', '复习', '🔁'],
  ['/deck', '卡组', '📚'],
  ['/scan', '拍照', '📷'],
  ['/pronounce', '发音', '🗣️'],
  ['/settings', '设置', '⚙️'],
] as const

export default function App() {
  const [ready, setReady] = useState(false)
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
            <Route path="/scan" element={<Scan />} />
            <Route path="/pronounce" element={<Pronunciation />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        ) : (
          <p className="muted">加载中…</p>
        )}
      </main>
      <nav className="tabbar">
        {TABS.map(([to, label, icon]) => (
          <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => (isActive ? 'tab active' : 'tab')}>
            <span className="ti">{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
