import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Own port so LifeOS never shares a localhost origin with other projects;
  // strictPort fails loudly instead of silently hopping to another port.
  server:  { port: 5200, strictPort: true },
  preview: { port: 5200, strictPort: true },
})
