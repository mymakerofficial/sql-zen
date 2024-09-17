<script setup lang="ts">
import { RouterView, useRoute, useRouter } from 'vue-router'
import DialogProvider from '@/components/shared/dialog/DialogProvider.vue'
import { useQueryClient } from '@tanstack/vue-query'
import AppHeader from '@/components/shared/appHeader/AppHeader.vue'
import { isTauri } from '@tauri-apps/api/core'
import { Toaster } from '@/components/ui/sonner'
import { useRegistry } from '@/composables/useRegistry'
import { useTabManager } from '@/composables/tabs/useTabManager'
import type { DatabaseEngine } from '@/lib/engines/enums'
import { DataSourceMode } from '@/lib/dataSources/enums'
import { TabType } from '@/lib/tabs/enums'
import { watchEffect } from 'vue'
import { TooltipProvider } from '@/components/ui/tooltip'

const queryClient = useQueryClient()

queryClient.setDefaultOptions({
  queries: {
    refetchOnWindowFocus: false,
    retry: false,
  },
})

const route = useRoute()
const router = useRouter()

if (isTauri() && route.path === '/') {
  router.replace('/app')
}

const registry = useRegistry()
const tabManager = useTabManager()

watchEffect(() => {
  if (
    typeof route.query === 'object' &&
    'createDataSource' in route.query &&
    'engine' in route.query
  ) {
    const { createDataSource, engine, ...query } = route.query as {
      createDataSource: string
      engine: DatabaseEngine
    } & Record<string, string>

    if (createDataSource !== 'true') {
      return
    }

    const dataSourceKey = registry.register({
      engine,
      mode: DataSourceMode.Memory,
      identifier: 'default',
    })

    tabManager.createTab({
      type: TabType.Console,
      dataSourceKey,
    })

    router.replace({
      query,
    })
  }
})
</script>

<template>
  <TooltipProvider>
    <DialogProvider />
    <Toaster />
    <div vaul-drawer-wrapper class="bg-background h-screen flex flex-col">
      <AppHeader :active-data-source="null" />
      <main class="flex-1 overflow-auto">
        <RouterView />
      </main>
    </div>
  </TooltipProvider>
</template>
