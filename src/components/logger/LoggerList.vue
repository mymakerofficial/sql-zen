<script setup lang="ts">
import type { Logger } from '@/lib/logger/logger'
import LogItem from '@/components/logger/LogItem.vue'
import { useLoggerEvents } from '@/composables/useLoggerEvents'

const props = defineProps<{
  logger: Logger
}>()

const events = useLoggerEvents(props.logger)
</script>

<template>
  <div class="flex-1 overflow-y-auto">
    <div v-if="true" class="flex flex-col">
      <LogItem v-for="event in events" :key="event.key" :event="event" />
    </div>
    <div v-else class="h-24 flex items-center justify-center">
      <i class="text-muted-foreground">*crickets*</i>
    </div>
  </div>
</template>
