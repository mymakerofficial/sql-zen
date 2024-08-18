import { TabManager } from '@/lib/tabs/manager/manager'
import { inject, provide, getCurrentInstance } from 'vue'

const mainTabManager = new TabManager()

export function provideTabManager(tabManager: TabManager = new TabManager()) {
  provide('__tabManager__', tabManager)
}

export function useTabManager() {
  const instance = getCurrentInstance()

  if (!instance) {
    return mainTabManager
  }

  return inject<TabManager>('__tabManager__', mainTabManager)
}
