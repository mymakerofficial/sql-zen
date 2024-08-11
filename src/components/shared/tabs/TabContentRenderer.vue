<script setup lang="ts">
import { useTabInfo } from '@/composables/tabs/useTabInfo'
import { TabType } from '@/lib/tabs/enums'
import TheWelcome from '@/components/shared/welcome/TheWelcome.vue'
import LoggerPanel from '@/components/logger/LoggerPanel.vue'
import QueryDisplay from '@/components/shared/query/QueryDisplay.vue'
import ConsoleTab from '@/components/console/ConsoleTab.vue'

const props = defineProps<{
  tabId: string
}>()

const tab = useTabInfo(props.tabId)
</script>

<template>
  <ConsoleTab v-if="tab.type === TabType.Console" :tab-id="tab.id" />
  <LoggerPanel v-else-if="tab.type === TabType.Logger" :id="tab.loggerId" />
  <QueryDisplay
    v-else-if="tab.type === TabType.Query"
    :data-source-key="tab.dataSourceKey"
    :query-id="tab.queryId"
  />
  <TheWelcome v-else-if="tab.type === TabType.Empty" />
</template>
