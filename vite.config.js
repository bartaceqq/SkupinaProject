import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production'
  const defaultBase = isProduction ? '/SkupinaProject/' : '/'
  const resolvedBase = process.env.VITE_APP_BASE || defaultBase

  return {
    base: resolvedBase,
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        manifest: false,
        includeAssets: ['icons/icon-192.png', 'icons/icon-512.png'],
        scope: resolvedBase,
        workbox: {
          globPatterns: ['**/*.{js,css,html,png,svg,ico,json}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/api\.frankfurter\.(app|dev)\//,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'currency-rates',
                expiration: {
                  maxEntries: 5,
                  maxAgeSeconds: 60 * 60,
                },
              },
            },
          ],
        },
      }),
    ],
    server: {
      port: 56489,
      host: '0.0.0.0',
    },
  }
})
