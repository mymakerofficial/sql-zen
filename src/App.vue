<script setup lang="ts">
import { RouterView } from 'vue-router'
import DialogProvider from '@/components/shared/dialog/DialogProvider.vue'
import { useQueryClient } from '@tanstack/vue-query'
import { Toaster } from '@/components/ui/sonner'
import { useRegistry } from '@/composables/useRegistry'
import { useTabManager } from '@/composables/tabs/useTabManager'
import { TabType } from '@/lib/tabs/enums'
import { TooltipProvider } from '@/components/ui/tooltip'
import { RegistryEvent } from '@/lib/registry/events'
import { isConsoleTab } from '@/lib/tabs/tabs/console'
import { MiddlewareProvider } from '@/middleware'

const queryClient = useQueryClient()
const registry = useRegistry()
const tabManager = useTabManager()

queryClient.setDefaultOptions({
  queries: {
    refetchOnWindowFocus: false,
    retry: false,
  },
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
    <MiddlewareProvider />
    <RouterView />
  </TooltipProvider>
</template>
