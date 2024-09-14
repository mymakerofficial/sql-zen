import { Tab } from '@/lib/tabs/tabs/base'
import type { LoggerTabData, LoggerTabInfo, TabInfo } from '@/lib/tabs/types'
import type { TabManager } from '@/lib/tabs/manager/manager'
import { TabType } from '@/lib/tabs/enums'
import type { Logger } from '@/lib/logger/impl/logger'

export class LoggerTab extends Tab implements LoggerTabInfo {
  readonly #loggerId: string

  constructor(tab: LoggerTabData, manager: TabManager) {
    super(tab, manager)
    this.#loggerId = tab.loggerId
  }

  get type() {
    return TabType.Logger
  }

  get preventClose() {
    return true
  }

  get canRename() {
    return false
  }

  getDefaultDisplayName(): string {
    return 'Output'
  }

  get loggerId() {
    return this.#loggerId
  }

  getInfo(): TabInfo {
    return {
      ...super.getBaseInfo(),
      type: TabType.Logger,
      loggerId: this.loggerId,
    }
  }

  getData(): LoggerTabData {
    return {
      ...super.getBaseData(),
      type: TabType.Logger,
      loggerId: this.loggerId,
    }
  }
}
