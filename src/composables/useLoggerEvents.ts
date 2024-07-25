import { type LogEvent, type Logger, LoggerEvent } from '@/lib/logger/logger'
import { onMounted, onUnmounted, ref } from 'vue'

export function useLoggerEvents(logger: Logger) {
  const events = ref<Array<LogEvent>>([])

  update()

  function update() {
    // we need to create a new array to trigger reactivity
    events.value = [...logger.getEvents()]
  }

  const handler = () => update()

  onMounted(() => {
    logger.on(LoggerEvent.Logged, handler)
  })

  onUnmounted(() => {
    logger.off(LoggerEvent.Logged, handler)
  })

  return events
}
