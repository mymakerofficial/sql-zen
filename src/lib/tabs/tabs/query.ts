import { Tab } from '@/lib/tabs/tabs/base'
import type { QueryTabData, QueryTabInfo, TabInfo } from '@/lib/tabs/types'
import type { TabManager } from '@/lib/tabs/manager/manager'
import { TabType } from '@/lib/tabs/enums'
import { useRegistry } from '@/composables/useRegistry'

const registry = useRegistry()

export class QueryTab extends Tab implements QueryTabInfo {
  #dataSourceKey: string
  #queryId: string

  constructor(tab: QueryTabData, manager: TabManager) {
    super(tab, manager)
    this.#dataSourceKey = tab.dataSourceKey
    this.#queryId = tab.queryId
  }

  get type() {
    return TabType.Query
  }

  get persistent() {
    return false
  }

  get displayName() {
    const index = registry
      .getDataSource(this.dataSourceKey)
      .runner.getQueryIndex(this.queryId)
    return `Query ${index + 1}`
  }

  get dataSourceKey() {
    return this.#dataSourceKey
  }

  get queryId() {
    return this.#queryId
  }

  getInfo(): TabInfo {
    return {
      ...super.getBaseInfo(),
      type: TabType.Query,
      dataSourceKey: this.dataSourceKey,
      queryId: this.queryId,
    }
  }

  destroy() {
    registry.getDataSource(this.dataSourceKey).runner.removeQuery(this.queryId)
  }
}

export function isQueryTab(tab: TabInfo): tab is QueryTabInfo {
  return tab.type === TabType.Query
}
