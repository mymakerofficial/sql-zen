import { useDataSourceStatus } from '@/composables/useDataSourceStatus'
import { computed, type MaybeRefOrGetter } from 'vue'
import { DataSourceStatus } from '@/lib/registry/enums'

export function useIsRunning(dataSourceKey: MaybeRefOrGetter) {
  const status = useDataSourceStatus(dataSourceKey)
  return computed(() => status.value === DataSourceStatus.Running)
}
