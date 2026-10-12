import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

function firstPublicApiUrl(...candidates) {
  for (const value of candidates) {
    if (typeof value !== 'string') continue
    const trimmed = value.trim()
    if (!trimmed) continue
    if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i.test(trimmed)) continue
    return trimmed.replace(/\/+$/, '')
  }
  return ''
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const backendUrl = firstPublicApiUrl(
    env.VITE_BACKEND_API_URL,
    env.VITE_API_URL,
    env.VITE_SERVER_URL,
    env.VITE_BACKEND_URL,
    env.BACKEND_API_URL,
    process.env.VITE_BACKEND_API_URL,
    process.env.VITE_API_URL,
    process.env.VITE_SERVER_URL,
    process.env.VITE_BACKEND_URL,
    process.env.BACKEND_API_URL,
  )

  const define = {}
  if (backendUrl) {
    define['import.meta.env.VITE_BACKEND_API_URL'] = JSON.stringify(backendUrl)
    define['import.meta.env.VITE_API_URL'] = JSON.stringify(backendUrl)
    define['import.meta.env.BACKEND_API_URL'] = JSON.stringify(backendUrl)
  }

  return {
    envPrefix: ['VITE_'],
    define,
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
        },
      },
    },
    build: {
      chunkSizeWarningLimit: 1000,
    },
  }
})
