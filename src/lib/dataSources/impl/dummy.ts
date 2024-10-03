import type { QueryResult } from '@/lib/queries/interface'
import { getId } from '@/lib/getId'
import { DataSource } from '@/lib/dataSources/impl/base'
import { DatabaseEngine, DataSourceDriver } from '@/lib/engines/enums'
import { DataSourceStatus } from '@/lib/dataSources/enums'
import { DataSourceEvent } from '@/lib/dataSources/events'

export class DataSourceDummy extends DataSource {
  get engine() {
    return DatabaseEngine.None
  }

  get driver() {
    return DataSourceDriver.None
  }

  isInitialized(): boolean {
    return true
  }

  async init() {
    this.setStatus(DataSourceStatus.Pending)
    this.emit(DataSourceEvent.Initializing)
    await this.logger.step('Initializing dummy data source', async () => {})
    this.logger.log(
      "If you're seeing this message and you're not a developer, something went wrong. Please reload the application and try again.",
    )
    this.setStatus(DataSourceStatus.Running)
    this.emit(DataSourceEvent.Initialized)
  }

  query<T extends object = object>(sql: string) {
    return this.logger.query(sql, async () => {
      return {
        fields: [],
        rows: [],
        affectedRows: null,
        duration: 0,
        systemDuration: 0,
        id: getId('result'),
      } as QueryResult<T>
    })
  }
}
