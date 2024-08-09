import { useState } from '@/composables/useState'
import { TabManagerEvent } from '@/lib/tabs/events'
import { onMounted, onUnmounted } from 'vue'
import { useTabManager } from '@/composables/useTabManager'

export function useTabIds() {
  const tabManager = useTabManager()
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
