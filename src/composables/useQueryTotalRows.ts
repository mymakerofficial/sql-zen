import type { IQuery } from '@/lib/queries/interface'
import { useQuery } from '@tanstack/vue-query'
import { onMounted, onUnmounted } from 'vue'
import { QueryEvent } from '@/lib/queries/events'

export function useQueryHasResult(query: IQuery) {
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
