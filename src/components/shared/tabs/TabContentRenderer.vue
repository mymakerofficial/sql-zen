<script setup lang="ts">
import { useTabInfo } from '@/composables/tabs/useTabInfo'
import { TabType } from '@/lib/tabs/enums'
import SuspendedConsole from '@/components/console/SuspendedConsole.vue'
import TheWelcome from '@/components/shared/welcome/TheWelcome.vue'
import LoggerPanel from '@/components/logger/LoggerPanel.vue'
import QueryDisplay from '@/components/shared/query/QueryDisplay.vue'

const props = defineProps<{
  tabId: string
}>()

const tab = useTabInfo(props.tabId)
</script>

<template>
  <SuspendedConsole
    v-if="tab.type === TabType.Console"
    :data-source-key="tab.dataSourceKey"
  />
  <LoggerPanel v-else-if="tab.type === TabType.Logger" :id="tab.loggerId" />
  <QueryDisplay
    v-else-if="tab.type === TabType.Query"
    :data-source-key="tab.dataSourceKey"
    :query-id="tab.queryId"
  />
  <TheWelcome v-else-if="tab.type === TabType.Empty" />
</template>
