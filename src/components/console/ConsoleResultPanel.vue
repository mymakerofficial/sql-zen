<script setup lang="ts">
import { provideTabManager } from '@/composables/tabs/useTabManager'
import TabView from '@/components/shared/tabs/TabView.vue'
import { ConsoleTabManager } from '@/lib/tabs/manager/consoleTabManager'

const props = withDefaults(
  defineProps<{
    dataSourceId: string
    showResults?: boolean
  }>(),
  {
    showResults: true,
  },
)

provideTabManager(new ConsoleTabManager(props.dataSourceId))
</script>

<template>
  <TabView />
</template>
