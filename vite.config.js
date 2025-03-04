import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    allowedHosts: ["hi-wanted-tri-deputy.trycloudflare.com"], // Allows all LocalTunnel subdomains
  },
  plugins: [react()],
})
