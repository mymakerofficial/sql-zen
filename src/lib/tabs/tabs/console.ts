import * as monaco from 'monaco-editor'
import { Tab } from '@/lib/tabs/tabs/base'
import { useRegistry } from '@/composables/useRegistry'
import { TabType } from '@/lib/tabs/enums'
import type { ConsoleTabData, ConsoleTabInfo } from '@/lib/tabs/types'
import {
  getDataSourceDisplayName,
  getDataSourceEngineInfo,
} from '@/lib/dataSources/helpers'
import type { TabManager } from '@/lib/tabs/manager/manager'

const registry = useRegistry()

export class ConsoleTab extends Tab implements ConsoleTabInfo {
  readonly #dataSourceKey: string
  readonly #model: monaco.editor.ITextModel

  constructor(tab: ConsoleTabData, manager: TabManager) {
    super(tab, manager)
    this.#dataSourceKey = tab.dataSourceKey
    this.#model = monaco.editor.createModel(tab.modelValue ?? '', 'sql')
  }

  get type() {
    return TabType.Console
  }

  get persistent() {
    return false
  }

  get displayName() {
    if (super.displayName === '') {
      const descriptor = this.getDataSourceInfo()
      return getDataSourceDisplayName(descriptor)
    }
    return super.displayName
  }

  get dataSourceKey() {
    return this.#dataSourceKey
  }

  get engineName() {
    return this.getEngineInfo().name
  }

  get engineIcon() {
    return this.getEngineInfo().icon
  }

  getInfo(): ConsoleTabInfo {
    return {
      ...super.getBaseInfo(),
      type: TabType.Console,
      dataSourceKey: this.dataSourceKey,
      engineName: this.engineName,
      engineIcon: this.engineIcon,
    }
  }

  getModel() {
    return this.#model
  }

  getDataSourceInfo() {
    return registry.getInfo(this.dataSourceKey)
  }

  getEngineInfo() {
    return getDataSourceEngineInfo(this.getDataSourceInfo())
  }
}
