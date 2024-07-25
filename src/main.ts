import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { VueQueryPlugin as vueQuery } from '@tanstack/vue-query'
import { routes, handleHotUpdate } from 'vue-router/auto-routes'
import '@/lib/monaco/setup'
import { useRegistry } from '@/composables/useRegistry'
import findPostgresDatabases from '@/lib/registry/findPostgres'
import findSqliteDatabases from '@/lib/registry/findSqlite'

const app = createApp(App)

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...routes,
    {
      path: '/postgresql',
      redirect: () => '/pg',
    },
  ],
})

if (import.meta.hot) {
  handleHotUpdate(router)
}

app.use(router)
app.use(vueQuery, {
  enableDevtoolsV6Plugin: true,
})

app.mount('#app')

const registry = useRegistry()

registry.use(findPostgresDatabases)
registry.use(findSqliteDatabases)

// @ts-ignore
globalThis.registry = registry
