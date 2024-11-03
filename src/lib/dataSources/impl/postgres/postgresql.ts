import { DatabaseEngine, DataSourceDriver } from '@/lib/engines/enums'
import { DataSourceStatus } from '@/lib/dataSources/enums'
import { DataSourceEvent } from '@/lib/dataSources/events'
import { invoke } from '@tauri-apps/api/core'
import {
  PostgresDataSource,
  type PostgresQueryResult,
} from '@/lib/dataSources/impl/postgres/base'
import { ipcQuery, ipcQueryRowsToObjects } from '@/lib/dataSources/impl/ipc'

export class PostgreSQLDataSource extends PostgresDataSource {
  get engine() {
    return DatabaseEngine.PostgreSQL
  }

  get driver() {
    return DataSourceDriver.PostgreSQL
  }

  async init() {
    if (this.status !== DataSourceStatus.Stopped) {
      return
    }

    this.setStatus(DataSourceStatus.Pending)
    this.emit(DataSourceEvent.Initializing)
    await this.logger.step('Connecting', async () => {
      await invoke('connect', {
        key: this.key,
        driver: this.driver,
        url: this.connectionString,
      }).catch((e) => {
        throw new Error(e)
      })
    })
    await this.logger.step('Testing connection...', async () => {
      const { rows } = await this.queryRaw('SELECT 1')

      if (rows.length !== 1) {
        throw new Error('Failed to connect to the database')
      }
    })
    this.setStatus(DataSourceStatus.Running)
    this.emit(DataSourceEvent.Initialized)
  }

  async queryRaw<T extends object = object>(
    sql: string,
  ): Promise<PostgresQueryResult<T>> {
    const res = await ipcQuery(this.key, sql)
    const { rows, columns } = ipcQueryRowsToObjects<T>(res)

    return {
      rows,
      fields: columns.map((column) => ({
        name: column.name,
        dataTypeID: column.dataTypeID ?? 0,
      })),
    }
  }
}
