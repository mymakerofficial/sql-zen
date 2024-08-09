import { TabType } from '@/lib/tabs/enums'
import { EventPublisher } from '@/lib/events/publisher'
import { getId } from '@/lib/getId'
import type { BaseTabData, BaseTabInfo, TabInfo } from '@/lib/tabs/types'

export abstract class Tab extends EventPublisher implements BaseTabInfo {
  readonly #id: string
  #displayName: string

  protected constructor(tab: BaseTabData) {
    super()
    this.#id = getId('tab')
    this.#displayName = tab.displayName ?? ''
  }

  get id() {
    return this.#id
  }

  abstract get type(): TabType

  get displayName() {
    return this.#displayName
  }

  set displayName(value: string) {
    this.#displayName = value
  }

  getBaseInfo(): BaseTabInfo {
    return {
      id: this.id,
      type: this.type,
      displayName: this.displayName,
    }
  }

  getInfo(): TabInfo {
    return this.getBaseInfo() as TabInfo
  }
}
