import { useQuery } from '@tanstack/vue-query'
import { onMounted, onUnmounted } from 'vue'
import { QueryEvent } from '@/lib/queries/events'
import type { Query } from '@/lib/queries/impl/query'

export function useQueryHasResult(query: Query) {
  const queryKey = ['query', query.getId(), 'hasResult']

  const { data, refetch } = useQuery({
    queryKey,
    queryFn: () => query.getHasResult(),
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
