import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  envPrefix: ['VITE_', 'BACKEND_'],
  define: {
    'import.meta.env.BACKEND_API_URL': JSON.stringify(process.env.BACKEND_API_URL || process.env.VITE_BACKEND_API_URL || ''),
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
})
