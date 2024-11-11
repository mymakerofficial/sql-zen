import * as monaco from 'monaco-editor'
import { Tab } from '@/lib/tabs/tabs/base'
import { useRegistry } from '@/composables/useRegistry'
import { TabType } from '@/lib/tabs/enums'
import type { ConsoleTabData, ConsoleTabInfo, TabInfo } from '@/lib/tabs/types'
import type { TabManager } from '@/lib/tabs/manager/manager'
import { useDebounceFn } from '@vueuse/core'
import { TabEvent } from '@/lib/tabs/events'
import { getExampleSql } from '@/lib/examples/getExampleSql'
import { getEngineInfo } from '@/lib/engines/helpers'
import { isTauri } from '@tauri-apps/api/core'

const registry = useRegistry()

function getModelValue(tab: ConsoleTabData) {
  if (tab.modelValue) {
    return tab.modelValue
  }

  if (isTauri()) {
    return ''
  }

  return getExampleSql(registry.getDataSource(tab.dataSourceId).engine)
}

export class ConsoleTab extends Tab implements ConsoleTabInfo {
  readonly #dataSourceId: string
  readonly #model: monaco.editor.ITextModel

  constructor(tab: ConsoleTabData, manager: TabManager) {
    super(tab, manager)
    this.#dataSourceId = tab.dataSourceId
    this.#model = monaco.editor.createModel(getModelValue(tab), 'sql')

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
    return this.getDataSourceInfo().displayName
  }

  get dataSourceId() {
    return this.#dataSourceId
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
      dataSourceId: this.dataSourceId,
      engineName: this.engineName,
      engineIcon: this.engineIcon,
    }
  }

  getData(): ConsoleTabData {
    return {
      ...super.getBaseData(),
      type: TabType.Console,
      dataSourceId: this.dataSourceId,
      modelValue: this.getModel().getValue(),
    }
  }

  getModel() {
    return this.#model
  }

  getDataSource() {
    return registry.getDataSource(this.dataSourceId)
  }

  getDataSourceInfo() {
    return this.getDataSource().getInfo()
  }

  getEngineInfo() {
    return getEngineInfo(this.getDataSource().engine)
  }
}

export function isConsoleTabInfo(tab: TabInfo): tab is ConsoleTabInfo {
  return tab.type === TabType.Console
}

export function isConsoleTab(tab: Tab): tab is ConsoleTab {
  return tab.type === TabType.Console
}
