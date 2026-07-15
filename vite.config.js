import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Overridable for subpath deployments (e.g. GitHub Pages project sites);
  // defaults to root for a custom-domain production deployment.
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  server: {
    allowedHosts: 'all',
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
  },
  preview: {
    allowedHosts: 'all',
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
  }
})
