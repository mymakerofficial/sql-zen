<script setup lang="ts">
import { type MessageLogEvent } from '@/lib/logger/logger'
import { InfoIcon } from 'lucide-vue-next'

defineProps<{
  event: MessageLogEvent
}>()
</script>

<template>
  <div class="flex gap-2 items-center">
    <InfoIcon class="size-5 min-w-max text-muted-foreground" />
    <p class="text-sm">{{ event.message }}</p>
  </div>
</template>
