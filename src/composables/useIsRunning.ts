import { computed, type MaybeRefOrGetter } from 'vue'
import { useDataSourceInfo } from '@/composables/dataSources/useDataSourceInfo'
import { DataSourceStatus } from '@/lib/dataSources/enums'

export function useIsRunning(dataSourceKey: MaybeRefOrGetter<string>) {
  const info = useDataSourceInfo(dataSourceKey)
  return computed(() => info.value.status === DataSourceStatus.Running)
}
