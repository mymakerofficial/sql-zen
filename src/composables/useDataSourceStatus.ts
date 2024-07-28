import { type MaybeRefOrGetter, onMounted, onUnmounted } from 'vue'
import { useRegistry } from '@/composables/useRegistry'
import { useQuery } from '@tanstack/vue-query'
import { EventType } from '@/lib/events/publisher'
import { toValue } from '@vueuse/core'
import { DataSourceStatus } from '@/lib/registry/enums'

export function useDataSourceStatus(dataSourceKey: MaybeRefOrGetter<string>) {
  const registry = useRegistry()

  const queryKey = ['dataSourceStatus', dataSourceKey]

  const { data, refetch } = useQuery({
    queryKey,
    queryFn: () => registry.getStatus(toValue(dataSourceKey)),
    initialData: DataSourceStatus.Stopped,
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
