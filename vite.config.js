/* eslint-disable no-undef */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy all /api/claude requests → Anthropic, injecting the API key server-side
      // This avoids CORS and keeps the key out of the browser bundle
      '/api/claude': {
        target: 'https://api.anthropic.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/claude/, '/v1/messages'),
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            const key = process.env.VITE_ANTHROPIC_API_KEY || '';
            proxyReq.setHeader('x-api-key', key);
            proxyReq.setHeader('anthropic-version', '2023-06-01');
            proxyReq.setHeader('content-type', 'application/json');
          });
        },
      },
    },
  },
})
