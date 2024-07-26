import { onMounted, onUnmounted } from 'vue'
import type { Runner } from '@/lib/runner/runner'
import { EventType } from '@/lib/events/publisher'
import { useQuery } from '@tanstack/vue-query'

export function useRunnerQueries(runner: Runner) {
  const queryKey = ['runnerQueries', runner.getDataSource().getKey()]

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
