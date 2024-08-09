import { computed, type MaybeRefOrGetter } from 'vue'
import { useDataSourceDescriptor } from '@/composables/useDataSourceDescriptor'
import { getDataSourceDisplayName } from '@/lib/dataSources/helpers'

export function useDataSourceDisplayName(
  dataSourceKey: MaybeRefOrGetter<string | null>,
) {
  const descriptor = useDataSourceDescriptor(dataSourceKey)
  return computed(() =>
    descriptor.value ? getDataSourceDisplayName(descriptor.value) : '',
  )
}
