import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vueRouter from 'unplugin-vue-router/vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: {
    exclude: ['@electric-sql/pglite', '@sqlite.org/sqlite-wasm'],
  },
  plugins: [
    vueRouter(),
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
