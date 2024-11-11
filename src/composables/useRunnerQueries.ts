import { onMounted, onUnmounted } from 'vue'
import { EventType } from '@/lib/events/publisher'
import { useQuery } from '@tanstack/vue-query'
import type { Runner } from '@/lib/runner/impl/runner'

export function useRunnerQueries(runner: Runner) {
  const queryKey = ['runner', runner.getId(), 'queries']

  const { data, refetch } = useQuery({
    queryKey,
    queryFn: () => runner.getQueries(),
    initialData: [],
  })

  const handler = () => refetch().then()

  onMounted(() => {
    runner.on(EventType.Any, handler)
  })

  onUnmounted(() => {
    runner.off(EventType.Any, handler)
  })

  return data
}
