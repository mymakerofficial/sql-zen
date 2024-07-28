import { onMounted, onUnmounted } from 'vue'
import { useRegistry } from '@/composables/useRegistry'
import { EventType } from '@/lib/events/publisher'
import { useQuery } from '@tanstack/vue-query'

export function useDataSources() {
  const registry = useRegistry()

  const queryKey = ['dataSourceKeys']

  const { data, refetch } = useQuery({
    queryKey,
    queryFn: () => registry.getDataSourceKeys(),
    initialData: [],
  })

  const handler = () => refetch().then()

  onMounted(() => {
    registry.on(EventType.Any, handler)
  })

  onUnmounted(() => {
    registry.off(EventType.Any, handler)
  })

  return data
}
