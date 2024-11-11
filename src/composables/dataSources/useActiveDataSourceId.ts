import { useActiveTabInfo } from '@/composables/tabs/useActiveTabInfo'
import { computed } from 'vue'
import { TabType } from '@/lib/tabs/enums'
import { DataSourceFactory } from '@/lib/dataSources/factory'

export function useActiveDataSourceId() {
  const activeTab = useActiveTabInfo()
  return computed(() => {
    if (activeTab.value.type === TabType.Console) {
      return activeTab.value.dataSourceId
    }
    return DataSourceFactory.dummy.id
  })
}
