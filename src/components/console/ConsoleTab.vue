<script setup lang="ts">
import SuspendedConsole from '@/components/console/SuspendedConsole.vue'
import { useTabManager } from '@/composables/tabs/useTabManager'
import { isConsoleTab } from '@/lib/tabs/tabs/console'

const props = defineProps<{
  tabId: string
}>()

const tabManager = useTabManager()
const tab = tabManager.getTab(props.tabId)
</script>

<template>
  <SuspendedConsole
    v-if="isConsoleTab(tab)"
    :data-source-key="tab.dataSourceKey"
    :model="tab.getModel()"
    auto-start
  />
</template>
