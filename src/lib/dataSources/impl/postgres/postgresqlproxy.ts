import { DatabaseEngine, DataSourceDriver } from '@/lib/engines/enums'
import { DataSourceStatus } from '@/lib/dataSources/enums'
import { DataSourceEvent } from '@/lib/dataSources/events'
import { invoke } from '@tauri-apps/api/core'
import {
  PostgresDataSource,
  type PostgresQueryResult,
} from '@/lib/dataSources/impl/postgres/base'

export class PostgreSQLProxy extends PostgresDataSource {
  get engine() {
    return DatabaseEngine.PostgreSQL
  }

  get driver() {
    return DataSourceDriver.PostgreSQL
  }

  async init() {
    this.setStatus(DataSourceStatus.Pending)
    this.emit(DataSourceEvent.Initializing)
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
    const res: {
      columns: { name: string; dataTypeID: number }[]
      rows: string[][]
    } = await invoke('run_query', {
      sql,
      url: this.connectionString,
    })

    const rows = res.rows.map((row) => {
      const obj: Record<string, string> = {}
      res.columns.forEach((field, i) => {
        obj[field.name] = row[i]
      })
      return obj as T
    })

    return {
      rows,
      fields: res.columns,
    }
  }
}
