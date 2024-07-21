<script setup lang="ts">
import type { Logger } from '@/lib/logger/logger'
import LogItem from '@/components/logger/LogItem.vue'
import { useLoggerEvents } from '@/composables/useLoggerEvents'
import { computed, nextTick, ref, watch } from 'vue'
import { useScroll, whenever } from '@vueuse/core'
import LoggerToolbar from '@/components/logger/LoggerToolbar.vue'

const props = defineProps<{
  logger: Logger
}>()

const container = ref<HTMLElement | null>(null)
const events = useLoggerEvents(props.logger)
const { arrivedState } = useScroll(container)

const isAtBottom = computed(() => {
  return arrivedState.bottom
})

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

function handleClear() {
  props.logger.clear()
}

function handleDown() {
  scrollToBottom()
}
</script>

<template>
  <div class="h-full flex flex-row">
    <div ref="container" class="flex-1 h-full flex flex-col overflow-y-auto">
      <LogItem v-for="event in events" :key="event.key" :event="event" />
    </div>
    <LoggerToolbar
      :can-clear="events.length > 0"
      :can-scroll-down="!isAtBottom"
      @clear="handleClear"
      @down="handleDown"
    />
  </div>
</template>
