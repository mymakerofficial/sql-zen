import { EmptyTab } from '@/lib/tabs/tabs/empty'
import { ConsoleTab } from '@/lib/tabs/tabs/console'
import { TabType } from '@/lib/tabs/enums'
import type { TabData } from '@/lib/tabs/types'

const empty = new EmptyTab()

export class TabFactory {
  static from(tab: TabData) {
    if (tab.type === TabType.Console) {
      return new ConsoleTab(tab)
    } else {
      return this.empty
    }
  }

  static get empty() {
    return empty
  }
}
