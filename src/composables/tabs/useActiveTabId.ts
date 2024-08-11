import { useState } from '@/composables/useState'
import { computed, onMounted, onUnmounted } from 'vue'
import { TabManagerEvent } from '@/lib/tabs/events'
import { useTabManager } from '@/composables/tabs/useTabManager'

export function useActiveTabId() {
  const tabManager = useTabManager()
  const [activeTab, setActiveTab] = useState(tabManager.getActiveTabId())

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
