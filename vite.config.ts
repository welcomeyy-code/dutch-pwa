import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// base './' 让同一份构建可放在任何 GitHub Pages 仓库路径下（配合 HashRouter）
export default defineConfig({
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Nederlands 学习',
        short_name: 'NL学习',
        description: '给中文母语者的荷兰语入门学习工具（A1–A2）',
        lang: 'zh-CN',
        start_url: './',
        scope: './',
        display: 'standalone',
        background_color: '#fffaf5',
        theme_color: '#ff6a1a',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
      workbox: { globPatterns: ['**/*.{js,css,html,svg,png}'] },
    }),
  ],
})
