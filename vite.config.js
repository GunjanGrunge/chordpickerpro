import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'docs', // Change output directory to 'docs'
    emptyOutDir: true
  },
  server: {
    port: 5173,
    strictPort: true
  }
})
