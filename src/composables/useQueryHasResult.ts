import type { IQuery } from '@/lib/queries/interface'
import { useQuery } from '@tanstack/vue-query'
import { onMounted, onUnmounted } from 'vue'
import { QueryEvent } from '@/lib/queries/events'

export function useQueryHasResult(query: IQuery) {
  const queryKey = ['queryHasResult', query.getId()]

  const { data, refetch } = useQuery({
    queryKey,
    queryFn: () => query.hasResult(),
    initialData: false,
  })

  const handler = () => refetch().then()

  onMounted(() => {
    query.on(QueryEvent.InitialResultCompleted, handler)
  })

  onUnmounted(() => {
    query.off(QueryEvent.InitialResultCompleted, handler)
  })

  return data
}
