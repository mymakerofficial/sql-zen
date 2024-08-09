import { Tab } from '@/lib/tabs/tabs/base'
import { TabType } from '@/lib/tabs/enums'
import type { EmptyTabInfo } from '@/lib/tabs/types'

export class EmptyTab extends Tab implements EmptyTabInfo {
  constructor() {
    super({
      type: TabType.Empty,
    })
  }

  get type() {
    return TabType.Empty
  }

  get displayName() {
    return 'Welcome!'
  }

  set displayName(_value) {}
}
