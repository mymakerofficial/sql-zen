import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { VueQueryPlugin as vueQuery } from '@tanstack/vue-query'
import { handleHotUpdate, routes } from 'vue-router/auto-routes'
import '@/lib/monaco/setup'
import { useRegistry } from '@/composables/useRegistry'
import { storeDataSources } from '@/lib/registry/plugins/storeDataSources'
import { useTabManager } from '@/composables/tabs/useTabManager'
import { RegistryEvent } from '@/lib/registry/events'
import { TabType } from '@/lib/tabs/enums'
import persistTabs from '@/lib/tabs/plugins/persistTabs'
import { useSeline } from '@/composables/seline/seline'
import { registryAnalytics } from '@/lib/registry/plugins/analytics'
import { selectableDatabaseEngines } from '@/lib/engines/constants'

const app = createApp(App)

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...routes,
    {
      path: '/dl',
      redirect: () => '/download',
    },
    ...selectableDatabaseEngines.map(({ engine }) => ({
      path: `/${engine}`,
      redirect: () => `/app?createDataSource=true&engine=${engine}`,
    })),
    {
      path: '/duck',
      redirect: () => '/duckdb',
    },
    {
      path: '/postgres',
      redirect: () => '/postgresql',
    },
    {
      path: '/pg',
      redirect: () => '/postgresql',
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

// init seline analytics
//  must happen after app is mounted
const { init: initSeline } = useSeline()
initSeline()

const registry = useRegistry()
const tabManager = useTabManager()

tabManager.use(persistTabs)

registry.on(RegistryEvent.Unregistered, (dataSourceKey) => {
  console.log('Unregistering', dataSourceKey)
  tabManager.getTabInfos().forEach((tab) => {
    if (tab.type === TabType.Console && tab.dataSourceKey === dataSourceKey) {
      tabManager.removeTab(tab.id)
    }
  })
})

registry.use(storeDataSources)

registry.use(registryAnalytics)

// @ts-ignore
globalThis.registry = registry
// @ts-ignore
globalThis.tabManager = tabManager
