import { TabManager } from '@/lib/tabs/manager/manager'
import type { DataSource } from '@/lib/dataSources/impl/base'
import { useRegistry } from '@/composables/useRegistry'
import { TabType } from '@/lib/tabs/enums'

const registry = useRegistry()

export class ConsoleTabManager extends TabManager {
  #dataSource: DataSource

  constructor(dataSourceKey: string) {
    super()
    this.#dataSource = registry.getDataSource(dataSourceKey)
    this.createTab({
      type: TabType.Logger,
      logger: this.#dataSource.logger,
    })
  }
}
