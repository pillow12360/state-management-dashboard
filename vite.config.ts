import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        dashboard: resolve(__dirname, 'index.html'),
        frame: resolve(__dirname, 'frame.html'),
      },
    },
  },
})
