import { type MaybeRefOrGetter, toValue, watchEffect } from 'vue'
import { useTabManager } from '@/composables/tabs/useTabManager'
import { useWritableExternalStore } from '@/composables/useExternalStore'
import { TabFactory } from '@/lib/tabs/tabs/factory'
import { EventType } from '@/lib/events/publisher'
import type { Tab } from '@/lib/tabs/tabs/base'

export function useTabDisplayName(tabId: MaybeRefOrGetter<string>) {
  const tabManager = useTabManager()

  let tab: Tab = TabFactory.empty

  const [name, setName] = useWritableExternalStore('', (value) => {
    tab.displayName = value
  })

  watchEffect((onCleanup) => {
    tab = tabManager.getTab(toValue(tabId))

    function handle() {
      setName(tab.displayName)
    }
    handle()

    tab.on(EventType.Any, handle)

    onCleanup(() => {
      tab.off(EventType.Any, handle)
    })
  })

  return name
}
