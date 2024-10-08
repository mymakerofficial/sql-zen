import { useExternalStore } from '@/composables/useExternalStore'
import { computed, onMounted, onUnmounted } from 'vue'
import { TabManagerEvent } from '@/lib/tabs/events'
import { useTabManager } from '@/composables/tabs/useTabManager'

export function useActiveTabId() {
  const tabManager = useTabManager()
  const [activeTab, setActiveTab] = useExternalStore(
    tabManager.getActiveTabId(),
  )

  onMounted(() => {
    tabManager.on(TabManagerEvent.ActiveTabChanged, setActiveTab)
  })

  onUnmounted(() => {
    tabManager.off(TabManagerEvent.ActiveTabChanged, setActiveTab)
  })

  return computed({
    get: () => activeTab.value,
    set: (id) => tabManager.setActiveTabId(id),
  })
}

export function useIsActiveTab(tabId: string) {
  const activeTabId = useActiveTabId()
  return computed(() => activeTabId.value === tabId)
}
