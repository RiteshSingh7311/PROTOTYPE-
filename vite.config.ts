import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/upcitemdb': {
        target: 'https://api.upcitemdb.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/upcitemdb/, '')
      }
    }
  }
})
