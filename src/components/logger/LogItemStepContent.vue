<script setup lang="ts">
import { CheckIcon, LoaderCircleIcon, XIcon } from 'lucide-vue-next'
import type { LogStepEvent } from '@/lib/logger/interface'
import { PromiseState } from '@/lib/logger/enums'

defineProps<{
  event: LogStepEvent
}>()
</script>

<template>
  <div class="flex gap-2 items-center">
    <LoaderCircleIcon
      v-if="event.data.state === PromiseState.Pending"
      class="size-5 min-h-max text-amber-400 animate-spin"
    />
    <CheckIcon
      v-else-if="event.data.state === PromiseState.Success"
      class="size-5 min-h-max text-green-500"
    />
    <XIcon
      v-else-if="event.data.state === PromiseState.Error"
      class="size-5 min-h-max text-red-500"
    />
    <p class="text-sm">{{ event.data.message }}</p>
    <p
      v-if="event.data.state === PromiseState.Error"
      class="text-red-500 text-sm"
    >
      {{ event.data.errorMessage }}
    </p>
  </div>
</template>
