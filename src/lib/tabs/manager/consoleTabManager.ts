import { TabManager } from '@/lib/tabs/manager/manager'
import type { DataSource } from '@/lib/dataSources/impl/base'
import { useRegistry } from '@/composables/useRegistry'
import { TabType } from '@/lib/tabs/enums'
import { RunnerEvent } from '@/lib/runner/events'
import type { QueryInfo } from '@/lib/queries/interface'
import { isQueryTab } from '@/lib/tabs/tabs/query'
import { TabFactory } from '@/lib/tabs/tabs/factory'

const registry = useRegistry()

export class ConsoleTabManager extends TabManager {
  #dataSource: DataSource

  constructor(dataSourceKey: string) {
    super()
    this.#dataSource = registry.getDataSource(dataSourceKey)
    this.createTab({
      type: TabType.Logger,
      logger: this.dataSource.logger,
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
      dataSourceKey: this.dataSource.key,
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
    const tab = this.getTabs()
      .filter(isQueryTab)
      .find((tab) => tab.queryId === queryId)
    return tab?.id ?? TabFactory.empty.id
  }
}
