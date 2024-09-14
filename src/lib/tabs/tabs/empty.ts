import { Tab } from '@/lib/tabs/tabs/base'
import { TabType } from '@/lib/tabs/enums'
import type { EmptyTabInfo } from '@/lib/tabs/types'

export class EmptyTab extends Tab implements EmptyTabInfo {
  constructor() {
    super(
      {
        type: TabType.Empty,
      },
      // @ts-ignore
      {
        on: () => {},
        off: () => {},
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

  get displayName() {
    return 'Welcome to SqlZen'
  }
}
