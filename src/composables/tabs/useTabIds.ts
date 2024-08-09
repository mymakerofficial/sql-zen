import { useState } from '@/composables/useState'
import { tabManager } from '@/lib/tabs/manager'
import { TabManagerEvent } from '@/lib/tabs/events'
import { onMounted, onUnmounted } from 'vue'

export function useTabIds() {
  const [tabs, setTabs] = useState(tabManager.getTabIds())

  function handleChange() {
    setTabs(tabManager.getTabIds())
  }

  onMounted(() => {
    tabManager.on(TabManagerEvent.TabAdded, handleChange)
    tabManager.on(TabManagerEvent.TabRemoved, handleChange)
  })

  onUnmounted(() => {
    tabManager.off(TabManagerEvent.TabAdded, handleChange)
    tabManager.off(TabManagerEvent.TabRemoved, handleChange)
  })

  return tabs
}
