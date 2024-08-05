import { onMounted, onUnmounted } from 'vue'
import { EventType } from '@/lib/events/publisher'
import { useQuery } from '@tanstack/vue-query'
import type { IRunner } from '@/lib/runner/interface'

export function useRunnerQueries(runner: IRunner) {
  const queryKey = ['runnerQueries', runner.getKey()]

  const { data, refetch } = useQuery({
    queryKey,
    queryFn: () => runner.getQueryIds(),
    initialData: [],
  })

  const handler = () => refetch()

  onMounted(() => {
    runner.on(EventType.Any, handler)
  })

  onUnmounted(() => {
    runner.off(EventType.Any, handler)
  })

  return data
}
