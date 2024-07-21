<script setup lang="ts">
import { type LogEvent, LogEventType } from '@/lib/logger/logger'
import LogItemStepContent from '@/components/logger/LogItemStepContent.vue'
import LogItemQueryContent from '@/components/logger/LogItemQueryContent.vue'

defineProps<{
  event: LogEvent
}>()
</script>

<template>
  <div class="p-4 border-b border-border">
    <template v-if="event.type === LogEventType.Query">
      <LogItemQueryContent :event="event" />
    </template>
    <template v-else-if="event.type === LogEventType.Step">
      <LogItemStepContent :event="event" />
    </template>
  </div>
</template>
