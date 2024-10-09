<script setup lang="ts">
import { InfoIcon } from 'lucide-vue-next'
import type { LogMessageEvent } from '@/lib/logger/interface'

defineProps<{
  event: LogMessageEvent
}>()
</script>

<template>
  <div class="flex gap-2 items-center">
    <InfoIcon class="size-5 min-w-max text-muted-foreground" />
    <p class="text-sm">{{ event.data.message }}</p>
  </div>
</template>
