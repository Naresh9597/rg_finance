import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // three.js lives in its own lazily loaded chunk (the hero 3D scene), so a large size is expected.
  build: { chunkSizeWarningLimit: 1000 },
})
