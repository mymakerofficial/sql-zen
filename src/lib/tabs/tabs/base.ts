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
    if (tab.displayName === undefined) {
      // setting the display name to '' will cause it to become the default value
      this.#displayName = ''
    } else {
      // ensure the display name is unique
      this.#displayName = this.#manager.getAssignedDisplayName(
        this.#id,
        tab.displayName,
      )
    }

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

  abstract get canRename(): boolean

  getDefaultDisplayName() {
    return ''
  }

  get displayName() {
    if (this.#displayName === '') {
      this.silentSetDisplayName(this.getDefaultDisplayName())
    }
    return this.#displayName
  }

  set displayName(value: string) {
    if (!this.canRename) {
      return
    }
    if (value === '') {
      value = this.getDefaultDisplayName()
    }
    this.silentSetDisplayName(value)
    this.emit(TabEvent.DisplayNameChanged, this.#displayName)
    this.emit(TabEvent.RequestSave)
  }

  protected silentSetDisplayName(value: string) {
    this.#displayName = this.#manager.getAssignedDisplayName(this.id, value)
  }

  getBaseInfo(): BaseTabInfo {
    return {
      id: this.id,
      preventClose: this.preventClose,
      canRename: this.canRename,
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
