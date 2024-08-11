<script setup lang="ts">
import { useTabInfo } from '@/composables/tabs/useTabInfo'
import { TabType } from '@/lib/tabs/enums'
import SuspendedConsole from '@/components/console/SuspendedConsole.vue'
import TheWelcome from '@/components/shared/welcome/TheWelcome.vue'
import LoggerPanel from '@/components/logger/LoggerPanel.vue'

const props = defineProps<{
  tabId: string
}>()

const info = useTabInfo(props.tabId)
</script>

<template>
  <SuspendedConsole
    v-if="info.type === TabType.Console"
    :data-source-key="info.dataSourceKey"
  />
  <LoggerPanel v-else-if="info.type === TabType.Logger" :id="info.loggerId" />
  <TheWelcome v-else />
</template>
