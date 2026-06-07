import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Note: localhost in development doesn't require HTTPS for getUserMedia
    host: 'localhost',
    port: 5173,
  },
})
