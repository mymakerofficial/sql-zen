import { Tab } from '@/lib/tabs/tabs/base'
import type { QueryTabData, QueryTabInfo, TabInfo } from '@/lib/tabs/types'
import type { TabManager } from '@/lib/tabs/manager/manager'
import { TabType } from '@/lib/tabs/enums'
import { useRegistry } from '@/composables/useRegistry'

const registry = useRegistry()

export class QueryTab extends Tab implements QueryTabInfo {
  #dataSourceId: string
  #queryId: string

  constructor(tab: QueryTabData, manager: TabManager) {
    super(tab, manager)
    this.#dataSourceId = tab.dataSourceId
    this.#queryId = tab.queryId
  }

  get type() {
    return TabType.Query
  }

  get preventClose() {
    return false
  }

  get canRename() {
    return true
  }

  getDefaultDisplayName(): string {
    const runner = registry.getRunner(this.dataSourceId)
    const comment = runner
      .getQuery(this.queryId)
      .statement.comment?.replace(/\s/g, ' ')
    return comment ?? 'Query'
  }

  get dataSourceId() {
    return this.#dataSourceId
  }

  get queryId() {
    return this.#queryId
  }

  getInfo(): TabInfo {
    return {
      ...super.getBaseInfo(),
      type: TabType.Query,
      dataSourceId: this.dataSourceId,
      queryId: this.queryId,
    }
  }

  getData(): QueryTabData {
    return {
      ...super.getBaseData(),
      type: TabType.Query,
      dataSourceId: this.dataSourceId,
      queryId: this.queryId,
    }
  }

  destroy() {
    registry.getDataSource(this.dataSourceId).runner.removeQuery(this.queryId)
  }
}

export function isQueryTabInfo(tab: TabInfo): tab is QueryTabInfo {
  return tab.type === TabType.Query
}
