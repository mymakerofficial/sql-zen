import { Tab } from '@/lib/tabs/tabs/base'
import { EventPublisher } from '@/lib/events/publisher'
import {
  TabEvent,
  TabManagerEvent,
  type TabManagerEventMap,
} from '@/lib/tabs/events'
import { TabFactory } from '@/lib/tabs/tabs/factory'
import { TabType } from '@/lib/tabs/enums'
import type { TabClass, TabData, TabInfo } from '@/lib/tabs/types'

export class TabManager extends EventPublisher<TabManagerEventMap> {
  #tabs: Map<string, Tab> = new Map()
  // array of tab ids in the order they should be displayed
  #tabSortOrder: string[] = []
  // array of tab ids in the order they were last active (most recent first)
  #tabHistory: string[] = []
  #activeTabId: string = TabFactory.empty.id
  // map of display names to set of tab ids that either have that name or tried to use it
  //  e.g. { 'name' -> Set('id1', 'id2'), 'name (1)' -> Set('id2') }
  #duplicateNamesMap: Map<string, Set<string>> = new Map()

  // called *after* setting the activeTabId to make sure
  //  the active tab is at the front of the history
  #updateTabHistory() {
    if (this.#activeTabId === TabFactory.empty.id) {
      return
    }
    this.#tabHistory = this.#tabHistory.filter((it) => it !== this.#activeTabId)
    this.#tabHistory.unshift(this.#activeTabId)
  }

  use<T>(plugin: (manager: TabManager) => T): T {
    return plugin(this)
  }

  getTabIds(): string[] {
    if (this.#tabSortOrder.length === 0) {
      return [TabFactory.empty.id]
    }
    return this.#tabSortOrder
  }

  getTabs(): Tab[] {
    return this.getTabIds().map((id) => this.getTab(id))
  }

  getTabInfos(): TabInfo[] {
    return this.getTabs().map((it) => it.getInfo())
  }

  #addTab(tab: Tab) {
    if (tab.type === TabType.Empty) {
      return
    }
    if (this.#tabs.has(tab.id)) {
      throw new Error(`Tab with id ${tab.id} already exists`)
    }
    this.#tabs.set(tab.id, tab)
    this.#tabSortOrder.push(tab.id)
    this.emit(TabManagerEvent.TabAdded, tab.getInfo())
    this.setActiveTabId(tab.id)
    tab.on(TabEvent.RequestSave, () => {
      this.emit(TabManagerEvent.TabRequestedSave, tab.getInfo())
    })
  }

  createTab<T extends TabData>(tab: T): TabClass<T['type']> {
    const newTab = TabFactory.create(tab, this) as TabClass<T['type']>
    this.#addTab(newTab)
    return newTab
  }

  removeTab(id: string) {
    if (id === TabFactory.empty.id) {
      return
    }
    const tab = this.#tabs.get(id)
    if (!tab) {
      throw new Error(`Tab with id ${id} not found`)
    }
    if (tab.preventClose) {
      return
    }
    this.#tabs.delete(id)
    this.#tabSortOrder = this.#tabSortOrder.filter((it) => it !== id)
    this.#tabHistory = this.#tabHistory.filter((it) => it !== id)
    this.#removeDisplayName(id, tab.displayName)
    this.emit(TabManagerEvent.TabAdded, tab.getInfo())
    this.setActiveTabId(this.#tabHistory[0] ?? TabFactory.empty.id)
  }

  getTab(id: string): Tab {
    return this.#tabs.get(id) ?? TabFactory.empty
  }

  getTabFromInfo<T extends TabInfo>(info: T): TabClass<T['type']> {
    return this.getTab(info.id) as TabClass<T['type']>
  }

  getTabInfo(id: string): TabInfo {
    return this.getTab(id).getInfo()
  }

  getActiveTabId() {
    return this.#activeTabId
  }

  setActiveTabId(id: string) {
    if (this.#activeTabId === id) {
      return
    }
    if (id !== TabFactory.empty.id && !this.#tabs.has(id)) {
      throw new Error(`Tab with id ${id} not found`)
    }
    const oldId = this.#activeTabId
    this.#activeTabId = id
    this.#updateTabHistory()
    this.emit(TabManagerEvent.ActiveTabChanged, id, oldId)
  }

  getOrdinalPosition(id: string) {
    return this.#tabSortOrder.indexOf(id)
  }

  #removeDisplayName(id: string, name: string) {
    this.#duplicateNamesMap.delete(name)
    this.#duplicateNamesMap.forEach((duplicates, key) => {
      duplicates.delete(id)
      if (duplicates.size === 0) {
        this.#duplicateNamesMap.delete(key)
      }
    })
  }

  #addDisplayName(id: string, name: string) {
    const duplicates = this.#duplicateNamesMap.get(name)
    if (duplicates === undefined) {
      const newSet = new Set([id])
      this.#duplicateNamesMap.set(name, newSet)
      return newSet
    } else {
      duplicates.add(id)
      return duplicates
    }
  }

  /***
   * Ensures that the display name is unique among all tabs
   * @param id id of the tab requesting the name
   * @param name requested display name
   * @param previousName previous display name of the tab
   */
  getAssignedDisplayName(
    id: string,
    name: string,
    previousName?: string,
  ): string {
    if (previousName) {
      this.#removeDisplayName(id, previousName)
    }

    const duplicates = this.#addDisplayName(id, name)
    // subtract 1 because the current tab is already counted
    const count = duplicates.size - 1

    if (count === 0) {
      return name
    }

    return this.getAssignedDisplayName(id, `${name} (${count + 1})`)
  }
}
