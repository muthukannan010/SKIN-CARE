import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const port = Number(env.VITE_PORT || env.PORT) || 5173
  const backendTarget = env.VITE_API_BASE_URL || `http://localhost:${env.BACKEND_PORT || 8000}`

  return {
    plugins: [react()],
    server: {
      port,
      host: true, // Listen on all network addresses (localhost, 127.0.0.1, LAN IP)
      proxy: {
        '/api': {
          target: backendTarget,
          changeOrigin: true,
        },
      },
    },
  }
})
