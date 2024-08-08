import { type MaybeRefOrGetter, onMounted, onUnmounted } from 'vue'
import { useRegistry } from '@/composables/useRegistry'
import { useQuery } from '@tanstack/vue-query'
import { EventType } from '@/lib/events/publisher'
import { toValue } from '@vueuse/core'

export function useDataSourceDescriptor(
  dataSourceKey: MaybeRefOrGetter<string | null>,
) {
  const registry = useRegistry()

  const queryKey = ['dataSourceDescriptor', dataSourceKey]

  const { data, refetch } = useQuery({
    queryKey,
    queryFn: () => {
      const key = toValue(dataSourceKey)
      if (!key) {
        return null
      }
      return registry.getDescriptor(key)
    },
    initialData: null,
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
