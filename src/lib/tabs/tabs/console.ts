import * as monaco from 'monaco-editor'
import { Tab } from '@/lib/tabs/tabs/base'
import { useRegistry } from '@/composables/useRegistry'
import { TabType } from '@/lib/tabs/enums'
import type { ConsoleTabData, ConsoleTabInfo } from '@/lib/tabs/types'
import {
  getDataSourceDisplayName,
  getDataSourceEngineInfo,
} from '@/lib/dataSources/helpers'
import { DatabaseEngine } from '@/lib/engines/enums'
import { DataSourceMode } from '@/lib/dataSources/enums'

const Registry = useRegistry()

export class ConsoleTab extends Tab implements ConsoleTabInfo {
  readonly #dataSourceKey: string
  readonly #model: monaco.editor.ITextModel

  constructor(tab: ConsoleTabData) {
    super(tab)
    this.#dataSourceKey = tab.dataSourceKey
    this.#model = monaco.editor.createModel(tab.modelValue ?? '', 'sql')
  }

  get type() {
    return TabType.Console
  }

  get displayName() {
    if (super.displayName === '') {
      const descriptor = this.getDataSourceDescriptor()
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

  getDataSourceDescriptor() {
    try {
      return Registry.getDescriptor(this.dataSourceKey)
    } catch (e) {
      console.error(e)
      return {
        engine: DatabaseEngine.PostgreSQL,
        mode: DataSourceMode.Memory,
        identifier: '<error>',
      }
    }
  }

  getEngineInfo() {
    return getDataSourceEngineInfo(this.getDataSourceDescriptor())
  }
}
