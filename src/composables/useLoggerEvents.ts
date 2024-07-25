import { type LogEvent, type Logger } from '@/lib/logger/logger'
import { onMounted, onUnmounted, ref } from 'vue'
import { EventType } from '@/lib/events/publisher'

export function useLoggerEvents(logger: Logger) {
  const events = ref<Array<LogEvent>>([])

  update()

  function update() {
    // we need to create a new array to trigger reactivity
    events.value = [...logger.getEvents()]
  }

  const handler = () => update()

  onMounted(() => {
    logger.on(EventType.Any, handler)
  })

  onUnmounted(() => {
    logger.off(EventType.Any, handler)
  })

  return events
}
