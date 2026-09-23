import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // PathPoint backend (../pathpoint). Change if it runs on another port.
      '/api': 'http://localhost:5050',
    },
  },
})
