import type { TabManager } from '@/lib/tabs/manager/manager'
import { EventType } from '@/lib/events/publisher'
import type { TabData } from '@/lib/tabs/types'

const STORAGE_KEY = 'sql-zen-tabs'

export default function persistTabs(manager: TabManager) {
  const serializedData = localStorage.getItem(STORAGE_KEY)

  if (serializedData) {
    const tabData = JSON.parse(serializedData) as TabData[]
    tabData.forEach((data) => {
      // for backward compatibility
      //  dataSourceId used to be dataSourceKey
      // @ts-expect-error
      if (data['dataSourceKey']) {
        // @ts-expect-error
        data['dataSourceId'] = data['dataSourceKey']
        // @ts-expect-error
        delete data['dataSourceKey']
      }
      manager.createTab(data)
    })
    // update in case of version change
    handleChange()
  }

  function handleChange() {
    const tabData = manager.getTabs().map((tab) => tab.getData())
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tabData))
  }

  manager.on(EventType.Any, handleChange)
}
