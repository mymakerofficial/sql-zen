<script setup lang="ts">
import { RouterView, useRoute, useRouter } from 'vue-router'
import DialogProvider from '@/components/shared/dialog/DialogProvider.vue'
import { useQueryClient } from '@tanstack/vue-query'
import { Toaster } from '@/components/ui/sonner'
import { useRegistry } from '@/composables/useRegistry'
import { useTabManager } from '@/composables/tabs/useTabManager'
import { DatabaseEngine } from '@/lib/engines/enums'
import { DataSourceMode } from '@/lib/dataSources/enums'
import { TabType } from '@/lib/tabs/enums'
import { watchEffect } from 'vue'
import { TooltipProvider } from '@/components/ui/tooltip'
import { getEngineInfo } from '@/lib/engines/helpers'
import { FileAccessor } from '@/lib/files/fileAccessor'
import { useEnv } from '@/composables/useEnv'
import { RegistryEvent } from '@/lib/registry/events'
import { isConsoleTab } from '@/lib/tabs/tabs/console'

const queryClient = useQueryClient()

queryClient.setDefaultOptions({
  queries: {
    refetchOnWindowFocus: false,
    retry: false,
  },
})

const route = useRoute()
const router = useRouter()
const { isTauri } = useEnv()

if (isTauri && route.path === '/') {
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

    const engineInfo = getEngineInfo(engine)
    registry.register({
      engine,
      driver: engineInfo.defaultDriver,
      mode: DataSourceMode.Memory,
      displayName: engineInfo.name,
      identifier: 'identifier',
      connectionString: '',
      fileAccessor: FileAccessor.Dummy,
    })

    // tab gets created by event handler

    router.replace({
      query,
    })
  }
})

registry.on(RegistryEvent.Initialized, (key) => {
  queryClient.invalidateQueries({
    queryKey: ['schemaTree', key],
  })
})

registry.on(RegistryEvent.Registered, (key) => {
  const existing = tabManager
    .getTabs()
    .find((tab) => isConsoleTab(tab) && tab.dataSourceKey === key)

  if (existing) {
    tabManager.setActiveTabId(existing.id)
    return
  }

  tabManager.createTab({
    type: TabType.Console,
    dataSourceKey: key,
  })
})
</script>

<template>
  <TooltipProvider>
    <DialogProvider />
    <Toaster />
    <RouterView />
  </TooltipProvider>
</template>
