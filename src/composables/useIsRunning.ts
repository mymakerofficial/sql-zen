import { computed, type MaybeRefOrGetter } from 'vue'
import { useDataSourceInfo } from '@/composables/dataSources/useDataSourceInfo'
import { DataSourceStatus } from '@/lib/dataSources/enums'

export function useIsRunning(dataSourceId: MaybeRefOrGetter<string>) {
  const info = useDataSourceInfo(dataSourceId)
  return computed(() => info.value.status === DataSourceStatus.Running)
}
