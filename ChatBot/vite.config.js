import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: [],
    },
    commonjsOptions: {
      esmExternals: true
    },
  },
  optimizeDeps: {
    include: ['@google/generative-ai']
  },
  server: {
    host: true
  }
})
