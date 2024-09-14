import { Tab } from '@/lib/tabs/tabs/base'
import { TabType } from '@/lib/tabs/enums'
import type { EmptyTabInfo } from '@/lib/tabs/types'

const DISPLAY_NAME = 'Welcome to SqlZen'

export class EmptyTab extends Tab implements EmptyTabInfo {
  constructor() {
    super(
      {
        type: TabType.Empty,
      },
      // @ts-ignore fake manager
      {
        on: () => {},
        off: () => {},
        getAssignedDisplayName: () => DISPLAY_NAME,
      },
    )
  }

  get type() {
    return TabType.Empty
  }

  get preventClose() {
    return true
  }

  get canRename() {
    return false
  }

  getDefaultDisplayName(): string {
    return DISPLAY_NAME
  }
}
