import { TabManager } from '@/lib/tabs/manager'

const tabManager = new TabManager()

export function useTabManager() {
  return tabManager
}
