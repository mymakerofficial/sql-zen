import { TabManager } from '@/lib/tabs/manager/manager'
import type { DataSource } from '@/lib/dataSources/impl/base'
import { useRegistry } from '@/composables/useRegistry'
import { TabType } from '@/lib/tabs/enums'
import { RunnerEvent } from '@/lib/runner/events'
import type { QueryInfo } from '@/lib/queries/interface'
import { isQueryTabInfo } from '@/lib/tabs/tabs/query'
import { TabFactory } from '@/lib/tabs/tabs/factory'

const registry = useRegistry()

export class ConsoleTabManager extends TabManager {
  #dataSource: DataSource

  constructor(dataSourceId: string) {
    super()
    this.#dataSource = registry.getDataSource(dataSourceId)
    this.createTab({
      type: TabType.Logger,
      loggerId: this.dataSource.logger.id,
    })
    this.dataSource.runner.getQueries().forEach(this.#onQueryResult.bind(this))
    this.dataSource.runner.on(
      RunnerEvent.QueryHasCompletedInitialResult,
      this.#onQueryResult.bind(this),
    )
    this.dataSource.runner.on(
      RunnerEvent.QueryRemoved,
      this.#onQueryRemoved.bind(this),
    )
  }

  #onQueryResult(query: QueryInfo) {
    if (!query.hasResultRows) {
      return
    }
    this.createTab({
      type: TabType.Query,
      dataSourceId: this.dataSource.id,
      queryId: query.id,
    })
  }

  #onQueryRemoved(query: QueryInfo) {
    this.removeTab(this.getTabByQueryId(query.id))
  }

  get dataSource() {
    return this.#dataSource
  }

  getTabByQueryId(queryId: string) {
    const tab = this.getTabInfos()
      .filter(isQueryTabInfo)
      .find((tab) => tab.queryId === queryId)
    return tab?.id ?? TabFactory.empty.id
  }
}
