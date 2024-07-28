<script setup lang="ts">
import LogItemStepContent from '@/components/logger/LogItemStepContent.vue'
import LogItemQueryContent from '@/components/logger/LogItemQueryContent.vue'
import LogItemMessageContent from '@/components/logger/LogItemMessageContent.vue'
import type { LogEvent } from '@/lib/logger/interface'
import { LogEventType } from '@/lib/logger/enums'

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
    <template v-else-if="event.type === LogEventType.Message">
      <LogItemMessageContent :event="event" />
    </template>
  </div>
</template>
