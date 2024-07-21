<script setup lang="ts">
import type { Logger } from '@/lib/logger/logger'
import LogItem from '@/components/logger/LogItem.vue'
import { useLoggerEvents } from '@/composables/useLoggerEvents'
import { nextTick, ref, watch } from 'vue'
import { whenever } from '@vueuse/core'

const props = defineProps<{
  logger: Logger
}>()

const container = ref<HTMLElement | null>(null)
const events = useLoggerEvents(props.logger)

async function scrollToBottom() {
  if (!container.value) {
    return
  }
  await nextTick()
  await nextTick()
  await nextTick()
  container.value.scrollTo({
    top: container.value.scrollHeight,
  })
}

watch(events, scrollToBottom)
whenever(container, scrollToBottom)
</script>

<template>
  <div ref="container" class="h-full flex flex-col overflow-y-auto">
    <LogItem v-for="event in events" :key="event.key" :event="event" />
  </div>
</template>
