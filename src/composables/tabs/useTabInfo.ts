import { type MaybeRefOrGetter, watchEffect, toValue } from 'vue'
import { useState } from '@/composables/useState'
import { TabFactory } from '@/lib/tabs/tabs/factory'
import { EventType } from '@/lib/events/publisher'
import { useTabManager } from '@/composables/tabs/useTabManager'

export function useTabInfo(tabId: MaybeRefOrGetter<string>) {
  const tabManager = useTabManager()
  const [info, setInfo] = useState(TabFactory.empty.getInfo())

  watchEffect((onCleanup) => {
    const tab = tabManager.getTab(toValue(tabId))

    function handle() {
      setInfo(tab.getInfo())
    }
    handle()

    tab.on(EventType.Any, handle)

    onCleanup(() => {
      tab.off(EventType.Any, handle)
    })
  })

  return info
}
