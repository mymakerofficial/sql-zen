import type { QueryResult } from '@/lib/queries/interface'
import { getId } from '@/lib/getId'
import { DataSource } from '@/lib/dataSources/impl/base'
import { DatabaseEngine } from '@/lib/engines/enums'
import { DataSourceStatus } from '@/lib/dataSources/enums'
import { DataSourceEvent } from '@/lib/dataSources/events'

export class DataSourceDummy extends DataSource {
  getEngine(): DatabaseEngine {
    return DatabaseEngine.None
  }

  isInitialized(): boolean {
    return true
  }

  async init() {
    this.setStatus(DataSourceStatus.Pending)
    this.emit(DataSourceEvent.Initializing)
    await this.logger.step('Initializing dummy data source', async () => {})
    this.setStatus(DataSourceStatus.Running)
    this.emit(DataSourceEvent.Initialized)
  }

  query<T extends object = object>(sql: string) {
    return this.logger.query(sql, async () => {
      return {
        columns: [],
        rows: [],
        affectedRows: null,
        duration: 0,
        id: getId('result'),
      } as QueryResult<T>
    })
  }
}
