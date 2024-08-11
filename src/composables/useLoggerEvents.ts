import { onMounted, onUnmounted } from 'vue'
import { EventType } from '@/lib/events/publisher'
import { useQuery } from '@tanstack/vue-query'
import type { Logger } from '@/lib/logger/impl/logger'

export function useLoggerEvents(logger: Logger) {
  const queryKey = ['logger', logger.id, 'events']

  const { data, refetch } = useQuery({
    queryKey,
    queryFn: () => logger.getEvents(),
    initialData: [],
  })

  const handler = () => refetch().then()

  onMounted(() => {
    logger.on(EventType.Any, handler)
  })

  onUnmounted(() => {
    logger.off(EventType.Any, handler)
  })

  return data
}
