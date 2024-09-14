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
  #displayNames: Map<
    string /* baseName */,
    Map<number /* number */, string /* tabId */>
  > = new Map()

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
    this.#removeDisplayName(id)
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

  #removeDisplayName(id: string) {
    this.#displayNames.forEach((duplicates, key) => {
      duplicates.forEach((tabId, number) => {
        if (tabId === id) {
          duplicates.delete(number)
        }
      })
    })
  }

  /***
   * Ensures that the display name is unique among all tabs
   * @param id id of the tab requesting the name
   * @param name requested display name
   */
  getAssignedDisplayName(id: string, name: string): string {
    // always trim the name
    name = name.trim()

    this.#removeDisplayName(id)
    const match = name.match(/^(?<name>.+)\s\((?<number>\d+)\)$/)

    const number = Number(match?.groups?.number ?? 1)
    const baseName = match?.groups?.name ?? name

    const duplicates = this.#displayNames.get(baseName)
    if (duplicates === undefined) {
      this.#displayNames.set(baseName, new Map([[number, id]]))
      return name
    }

    // baseName already exists
    //  check if number is already taken

    const existingId = duplicates.get(number)
    if (existingId === undefined || existingId === id) {
      duplicates.set(number, id)
      return name
    }

    // baseName with number already exists
    //  find next available number

    const newNumber = [...duplicates.keys()]
      .sort((a, b) => a - b)
      .reduce((acc, cur) => (acc === cur ? acc + 1 : acc), 1)

    const newName = newNumber === 1 ? baseName : `${baseName} (${newNumber})`

    if (this.#displayNames.has(newName)) {
      // new name matches another baseName
      //  this happens when a name has multiple numbers e.g. 'Name (4) (5)'
      return this.getAssignedDisplayName(id, newName)
    }

    duplicates.set(newNumber, id)
    return newName
  }
}
