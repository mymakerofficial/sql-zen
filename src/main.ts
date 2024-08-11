import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { VueQueryPlugin as vueQuery } from '@tanstack/vue-query'
import { routes, handleHotUpdate } from 'vue-router/auto-routes'
import '@/lib/monaco/setup'
import { useRegistry } from '@/composables/useRegistry'
import findPostgresDatabases from '@/lib/registry/plugins/findPostgres'
import findSqliteDatabases from '@/lib/registry/plugins/findSqlite'
import { storeInMemorySources } from '@/lib/registry/plugins/storeInMemorySources'
import { useTabManager } from '@/composables/tabs/useTabManager'
import { RegistryEvent } from '@/lib/registry/events'
import { TabType } from '@/lib/tabs/enums'

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
const tabManager = useTabManager()

registry.on(RegistryEvent.Registered, (dataSourceKey) => {
  tabManager.createTab({
    type: TabType.Console,
    dataSourceKey,
  })
})

registry.on(RegistryEvent.Unregistered, (dataSourceKey) => {
  console.log('Unregistering', dataSourceKey)
  tabManager.getTabs().forEach((tab) => {
    if (tab.type === TabType.Console && tab.dataSourceKey === dataSourceKey) {
      tabManager.removeTab(tab.id)
    }
  })
})

registry.use(findPostgresDatabases)
registry.use(findSqliteDatabases)
registry.use(storeInMemorySources)

// @ts-ignore
globalThis.registry = registry
