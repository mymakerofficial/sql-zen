import * as monaco from 'monaco-editor'
import { Tab } from '@/lib/tabs/tabs/base'
import { useRegistry } from '@/composables/useRegistry'
import { TabType } from '@/lib/tabs/enums'
import type { ConsoleTabData, ConsoleTabInfo, TabInfo } from '@/lib/tabs/types'
import {
  getDataSourceDisplayName,
  getDataSourceEngineInfo,
} from '@/lib/dataSources/helpers'
import type { TabManager } from '@/lib/tabs/manager/manager'
import { useDebounceFn } from '@vueuse/core'
import { TabEvent } from '@/lib/tabs/events'
import { getExampleSql } from '@/lib/examples/getExampleSql'

const registry = useRegistry()

export class ConsoleTab extends Tab implements ConsoleTabInfo {
  readonly #dataSourceKey: string
  readonly #model: monaco.editor.ITextModel

  constructor(tab: ConsoleTabData, manager: TabManager) {
    super(tab, manager)
    this.#dataSourceKey = tab.dataSourceKey
    this.#model = monaco.editor.createModel(
      tab.modelValue ??
        getExampleSql(registry.getDataSource(this.dataSourceKey).engine),
      'sql',
    )

    const debouncedSave = useDebounceFn(() => {
      this.emit(TabEvent.RequestSave)
    }, 1000)
    this.#model.onDidChangeContent(debouncedSave)
  }

  get type() {
    return TabType.Console
  }

  get preventClose() {
    return false
  }

  get canRename() {
    return true
  }

  getDefaultDisplayName() {
    const descriptor = this.getDataSourceInfo()
    return getDataSourceDisplayName(descriptor)
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

  getData(): ConsoleTabData {
    return {
      ...super.getBaseData(),
      type: TabType.Console,
      dataSourceKey: this.dataSourceKey,
      modelValue: this.getModel().getValue(),
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

export function isConsoleTabInfo(tab: TabInfo): tab is ConsoleTabInfo {
  return tab.type === TabType.Console
}

export function isConsoleTab(tab: Tab): tab is ConsoleTab {
  return tab.type === TabType.Console
}
