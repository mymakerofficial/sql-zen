import type { QueryResult } from '@/lib/queries/interface'
import { getId } from '@/lib/getId'
import { DataSource } from '@/lib/dataSources/impl/base'
import { DatabaseEngine, DataSourceDriver } from '@/lib/engines/enums'
import { DataSourceStatus } from '@/lib/dataSources/enums'
import { DataSourceEvent } from '@/lib/dataSources/events'

export class MySqlDataSource extends DataSource {
  get engine() {
    return DatabaseEngine.MySQL
  }

  get driver() {
    return DataSourceDriver.MySQL
  }

  async init() {
    this.setStatus(DataSourceStatus.Pending)
    this.emit(DataSourceEvent.Initializing)
    this.logger.log('Hello im a MySQL database.')
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
