import { TabManager } from '@/lib/tabs/manager/manager'
import { inject, provide } from 'vue'

const mainTabManager = new TabManager()

export function provideTabManager(tabManager: TabManager = new TabManager()) {
  provide('__tabManager__', tabManager)
}

export function useTabManager() {
  const injectedTabManager = inject<TabManager>('__tabManager__')
  return injectedTabManager ?? mainTabManager
}
