import type { LogEvent, Logger } from '@/lib/logger/logger'
import { onMounted, onUnmounted, ref } from 'vue'

export function useLoggerEvents(logger: Logger) {
  const events = ref<Array<LogEvent>>([])

  update()

  function update() {
    console.log(logger.getEvents())
    // we need to create a new array to trigger reactivity
    events.value = [...logger.getEvents()]
  }

  onMounted(() => {
    logger.on(() => update())
  })

  onUnmounted(() => {
    logger.off(() => update())
  })

  return events
}
