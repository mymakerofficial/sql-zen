import { onMounted, onUnmounted } from 'vue'
import { EventType } from '@/lib/events/publisher'
import type { ILogger } from '@/lib/logger/interface'
import { useQuery } from '@tanstack/vue-query'

export function useLoggerEvents(logger: ILogger) {
  const queryKey = ['loggerEvents', logger.getKey()]

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
