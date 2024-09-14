import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vueRouter from 'unplugin-vue-router/vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { VitePWA as vitePWA } from 'vite-plugin-pwa'

const host = process.env.TAURI_DEV_HOST

// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: {
    exclude: [
      '@electric-sql/pglite',
      '@sqlite.org/sqlite-wasm',
      '@duckdb/duckdb-wasm',
    ],
  },
  plugins: [
    vueRouter(),
    vue(),
    vueDevTools(),
    vitePWA({
      // prompt the user to update the app when a new version is available
      registerType: 'prompt',
      // inline to ensure the service worker immediately caches the app
      injectRegister: 'inline',
      strategies: 'generateSW',
      workbox: {
        cleanupOutdatedCaches: true,
        globPatterns: [
          '**/*.{js,css,html,ico,png,svg,json,vue,txt,woff2,ttf,data,wasm}',
        ],
        maximumFileSizeToCacheInBytes: 40000000,
      },
      // use custom manifest
      manifest: false,
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    // we have one top-level await in src/lib/highlighter.ts
    target: 'esnext',
  },
  worker: {
    // avoid "UMD and IIFE output formats are not supported for code-splitting builds." error
    format: 'es',
  },
  // prevent vite from obscuring rust errors
  clearScreen: false,
  // tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: 'ws',
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      // tell vite to ignore watching `src-tauri`
      ignored: ['**/src-tauri/**'],
    },
  },
})
