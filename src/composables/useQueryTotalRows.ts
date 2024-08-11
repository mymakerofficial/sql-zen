import { useQuery } from '@tanstack/vue-query'
import { onMounted, onUnmounted } from 'vue'
import { QueryEvent } from '@/lib/queries/events'
import type { Query } from '@/lib/queries/impl/query'

export function useQueryHasResult(query: Query) {
  const queryKey = ['query', query.getId(), 'totalRows']

  const { data, refetch } = useQuery({
    queryKey,
    queryFn: () => query.getTotalRowCount(),
    initialData: {
      min: 0,
      isKnown: false,
    },
  })

  const handler = () => refetch().then()

  onMounted(() => {
    query.on(QueryEvent.TotalRowsChanged, handler)
  })

  onUnmounted(() => {
    query.off(QueryEvent.TotalRowsChanged, handler)
  })

  return data
}
