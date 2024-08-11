import { Tab } from '@/lib/tabs/tabs/base'
import type { LoggerTabData, LoggerTabInfo, TabInfo } from '@/lib/tabs/types'
import type { TabManager } from '@/lib/tabs/manager/manager'
import { TabType } from '@/lib/tabs/enums'
import type { Logger } from '@/lib/logger/impl/logger'

export class LoggerTab extends Tab implements LoggerTabInfo {
  readonly #logger: Logger

  constructor(tab: LoggerTabData, manager: TabManager) {
    super(tab, manager)
    this.#logger = tab.logger
  }

  get type() {
    return TabType.Logger
  }

  get persistent() {
    return true
  }

  get displayName() {
    return 'Output'
  }

  get loggerId() {
    return this.#logger.getId()
  }

  getInfo(): TabInfo {
    return {
      ...super.getBaseInfo(),
      type: TabType.Logger,
      loggerId: this.loggerId,
    }
  }
}
