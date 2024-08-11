import { onMounted, onUnmounted } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { QueryEvent } from '@/lib/queries/events'
import { DataSourceStatus } from '@/lib/dataSources/enums'
import type { Query } from '@/lib/queries/impl/query'

export function useQueryState(query: Query) {
  const queryKey = ['query', query.getId(), 'state']

  const { data, refetch } = useQuery({
    queryKey,
    queryFn: () => query.getState(),
    initialData: DataSourceStatus.Stopped,
  })

  const handler = () => refetch().then()

  onMounted(() => {
    query.on(QueryEvent.StateChanged, handler)
  })

  onUnmounted(() => {
    query.off(QueryEvent.StateChanged, handler)
  })

  return data
}
