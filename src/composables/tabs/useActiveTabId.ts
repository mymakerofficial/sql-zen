import { useState } from '@/composables/useState'
import { tabManager } from '@/lib/tabs/manager'
import { computed, onMounted, onUnmounted } from 'vue'
import { TabManagerEvent } from '@/lib/tabs/events'

export function useActiveTabId() {
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
