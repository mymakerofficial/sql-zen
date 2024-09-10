import { TabManager } from '@/lib/tabs/manager/manager'
import { EventType } from '@/lib/events/publisher'
import type { TabData } from '@/lib/tabs/types'

const STORAGE_KEY = 'sql-zen-tabs'

export const persistTabs = TabManager.definePlugin((manager) => {
  const serializedData = localStorage.getItem(STORAGE_KEY)

  if (serializedData) {
    const tabData = JSON.parse(serializedData) as TabData[]
    tabData.forEach((data) => manager.createTab(data))
  }

  function handleChange() {
    const tabData = manager.getTabs().map((tab) => tab.getData())
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tabData))
  }

  manager.on(EventType.Any, handleChange)
})