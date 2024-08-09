import { useActiveTabId } from '@/composables/tabs/useActiveTabId'
import { useTabInfo } from '@/composables/tabs/useTabInfo'

export function useActiveTabInfo() {
  const activeTabId = useActiveTabId()
  return useTabInfo(activeTabId)
}
