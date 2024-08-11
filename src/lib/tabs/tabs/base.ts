import { TabType } from '@/lib/tabs/enums'
import { EventPublisher } from '@/lib/events/publisher'
import { getId } from '@/lib/getId'
import type {
  BaseTabData,
  BaseTabInfo,
  TabData,
  TabInfo,
} from '@/lib/tabs/types'
import { TabEvent, type TabEventMap, TabManagerEvent } from '@/lib/tabs/events'
import type { TabManager } from '@/lib/tabs/manager/manager'

export abstract class Tab
  extends EventPublisher<TabEventMap>
  implements BaseTabInfo
{
  readonly #manager: TabManager
  readonly #id: string
  #displayName: string

  protected constructor(tab: BaseTabData, manager: TabManager) {
    super()
    this.#manager = manager
    this.#id = getId('tab')
    this.#displayName = tab.displayName ?? ''

    this.#manager.on(TabManagerEvent.TabRemoved, this.#onRemove)
  }

  #onRemove(info: TabInfo) {
    if (info.id === this.id) {
      this.#manager.off(TabManagerEvent.TabRemoved, this.#onRemove)
      this.destroy()
    }
  }

  get id() {
    return this.#id
  }

  abstract get type(): TabType

  abstract get preventClose(): boolean

  get displayName() {
    return this.#displayName
  }

  set displayName(value: string) {
    this.#displayName = value
    this.emit(TabEvent.DisplayNameChanged, value)
    this.emit(TabEvent.RequestSave)
  }

  getBaseInfo(): BaseTabInfo {
    return {
      id: this.id,
      preventClose: this.preventClose,
      type: this.type,
      displayName: this.displayName,
    }
  }

  getInfo(): TabInfo {
    return this.getBaseInfo() as TabInfo
  }

  getBaseData(): BaseTabData {
    return {
      type: this.type,
      displayName: this.displayName,
    }
  }

  getData(): TabData {
    return this.getBaseData() as TabData
  }

  destroy(): void {}
}
