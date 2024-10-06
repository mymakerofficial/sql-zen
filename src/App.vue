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
    const dataSourceKey = registry.register({
      engine,
      driver: engineInfo.defaultDriver,
      mode: DataSourceMode.Memory,
      displayName: engineInfo.name,
      identifier: 'identifier',
      connectionString: '',
      fileAccessor: FileAccessor.Dummy,
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

registry.on(RegistryEvent.Initialized, (key) => {
  queryClient.invalidateQueries({
    queryKey: ['schemaTree', key],
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
