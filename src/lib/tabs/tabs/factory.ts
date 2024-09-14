import { EmptyTab } from '@/lib/tabs/tabs/empty'
import { ConsoleTab } from '@/lib/tabs/tabs/console'
import { TabType } from '@/lib/tabs/enums'
import type { TabData } from '@/lib/tabs/types'
import type { TabManager } from '@/lib/tabs/manager/manager'
import { LoggerTab } from '@/lib/tabs/tabs/logger'
import { QueryTab } from '@/lib/tabs/tabs/query'
import { TestTab } from '@/lib/tabs/tabs/test'

const empty = new EmptyTab()

export class TabFactory {
  static create(tab: TabData, manager: TabManager) {
    if (tab.type === TabType.Console) {
      return new ConsoleTab(tab, manager)
    } else if (tab.type === TabType.Logger) {
      return new LoggerTab(tab, manager)
    } else if (tab.type === TabType.Query) {
      return new QueryTab(tab, manager)
    } else if (tab.type === TabType.Test) {
      return new TestTab(tab, manager)
    } else {
      return this.empty
    }
  }

  static get empty() {
    return empty
  }
}
