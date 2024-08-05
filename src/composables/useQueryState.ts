import { onMounted, onUnmounted } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { DataSourceStatus } from '@/lib/registry/enums'
import type { IQuery } from '@/lib/queries/interface'
import { QueryEvent } from '@/lib/queries/events'

export function useQueryState(query: IQuery) {
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
