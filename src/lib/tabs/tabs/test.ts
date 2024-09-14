import { Tab } from '@/lib/tabs/tabs/base'
import type { TabInfo, TestTabData, TestTabInfo } from '@/lib/tabs/types'
import type { TabManager } from '@/lib/tabs/manager/manager'
import { TabType } from '@/lib/tabs/enums'

export class TestTab extends Tab implements TestTabInfo {
  #preventClose: boolean
  #canRename: boolean
  #defaultDisplayName: string

  constructor(tab: TestTabData, manager: TabManager) {
    super(tab, manager)
    this.#preventClose = tab.preventClose ?? false
    this.#canRename = tab.canRename ?? true
    this.#defaultDisplayName = tab.defaultDisplayName ?? 'Default Test Tab Name'
  }

  get type() {
    return TabType.Test
  }

  get preventClose() {
    return this.#preventClose
  }

  get canRename() {
    return this.#canRename
  }

  getDefaultDisplayName() {
    return this.#defaultDisplayName
  }

  get defaultDisplayName() {
    return this.#defaultDisplayName
  }

  getInfo(): TabInfo {
    return {
      ...super.getBaseInfo(),
      type: TabType.Test,
      preventClose: this.preventClose,
      canRename: this.canRename,
      defaultDisplayName: this.defaultDisplayName,
    }
  }

  getData(): TestTabData {
    return {
      ...super.getBaseData(),
      type: TabType.Test,
      preventClose: this.preventClose,
      canRename: this.canRename,
      defaultDisplayName: this.defaultDisplayName,
    }
  }
}
