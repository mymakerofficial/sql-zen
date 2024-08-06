<script setup lang="ts">
import LogItem from '@/components/logger/LogItem.vue'
import { useLoggerEvents } from '@/composables/useLoggerEvents'
import { computed, nextTick, ref, watch } from 'vue'
import { syncRefs, useScroll, whenever } from '@vueuse/core'
import LoggerToolbar from '@/components/logger/LoggerToolbar.vue'
import type { ILogger } from '@/lib/logger/interface'

const props = defineProps<{
  logger: ILogger
}>()

const container = ref<HTMLElement | null>(null)
const events = useLoggerEvents(props.logger)
const { arrivedState } = useScroll(container)

const stickToBottom = ref(true)

const isAtBottom = computed(() => {
  return arrivedState.bottom
})

syncRefs(isAtBottom, stickToBottom)

async function scrollToBottom() {
  if (!stickToBottom.value) {
    return
  }

  // yes this needs be like this
  await nextTick()
  await nextTick()
  await nextTick()

  if (!container.value) {
    return
  }

  container.value.scrollTo({
    top: container.value.scrollHeight,
  })
}

watch(events, scrollToBottom)
whenever(container, scrollToBottom)
whenever(stickToBottom, scrollToBottom)

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
      <LogItem v-for="event in events" :key="event.id" :event="event" />
      <div
        v-if="events.length === 0"
        class="h-24 flex justify-center items-center"
      >
        <i class="text-muted-foreground">*crickets*</i>
      </div>
    </div>
    <LoggerToolbar
      :can-clear="events.length > 0"
      v-model:stick-to-bottom="stickToBottom"
      @clear="handleClear"
      @down="handleDown"
    />
  </div>
</template>
