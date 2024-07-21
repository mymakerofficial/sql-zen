<script setup lang="ts">
import { PromiseState, type StepLogEvent } from '@/lib/logger/logger'
import { CheckIcon, LoaderCircleIcon, XIcon } from 'lucide-vue-next'

defineProps<{
  event: StepLogEvent
}>()
</script>

<template>
  <div class="flex gap-2 items-center">
    <LoaderCircleIcon
      v-if="event.state === PromiseState.Pending"
      class="size-5 text-amber-400 animate-spin"
    />
    <CheckIcon
      v-else-if="event.state === PromiseState.Success"
      class="size-5 text-green-500"
    />
    <XIcon
      v-else-if="event.state === PromiseState.Error"
      class="size-5 text-red-500"
    />
    <p class="text-sm">{{ event.message }}</p>
  </div>
</template>
