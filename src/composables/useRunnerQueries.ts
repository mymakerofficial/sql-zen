import { onMounted, onUnmounted } from 'vue'
import { EventType } from '@/lib/events/publisher'
import { useQuery } from '@tanstack/vue-query'
import type { IRunner } from '@/lib/runner/interface'

export function useRunnerQueries(runner: IRunner) {
  const queryKey = ['runner', runner.getKey(), 'queries']

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
