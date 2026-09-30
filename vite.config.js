import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const backendUrl =
    env.VITE_BACKEND_API_URL ||
    env.VITE_API_URL ||
    env.VITE_SERVER_URL ||
    env.VITE_BACKEND_URL ||
    env.BACKEND_API_URL ||
    process.env.VITE_BACKEND_API_URL ||
    process.env.VITE_API_URL ||
    process.env.VITE_SERVER_URL ||
    process.env.VITE_BACKEND_URL ||
    process.env.BACKEND_API_URL ||
    ''

  return {
    envPrefix: ['VITE_', 'BACKEND_'],
    define: {
      'import.meta.env.BACKEND_API_URL': JSON.stringify(backendUrl),
      'import.meta.env.VITE_BACKEND_API_URL': JSON.stringify(backendUrl),
      'import.meta.env.VITE_API_URL': JSON.stringify(backendUrl),
    },
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
