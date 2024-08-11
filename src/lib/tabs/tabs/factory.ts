import { EmptyTab } from '@/lib/tabs/tabs/empty'
import { ConsoleTab } from '@/lib/tabs/tabs/console'
import { TabType } from '@/lib/tabs/enums'
import type { TabData } from '@/lib/tabs/types'
import type { TabManager } from '@/lib/tabs/manager/manager'
import { LoggerTab } from '@/lib/tabs/tabs/logger'

const empty = new EmptyTab()

export class TabFactory {
  static create(tab: TabData, manager: TabManager) {
    if (tab.type === TabType.Console) {
      return new ConsoleTab(tab, manager)
    } else if (tab.type === TabType.Logger) {
      return new LoggerTab(tab, manager)
    } else {
      return this.empty
    }
  }

  static get empty() {
    return empty
  }
}
