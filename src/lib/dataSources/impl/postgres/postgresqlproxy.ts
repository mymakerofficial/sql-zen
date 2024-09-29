import { DatabaseEngine } from '@/lib/engines/enums'
import { DataSourceStatus } from '@/lib/dataSources/enums'
import { DataSourceEvent } from '@/lib/dataSources/events'
import { invoke } from '@tauri-apps/api/core'
import {
  PostgresBaseDataSource,
  type PostgresQueryResult,
} from '@/lib/dataSources/impl/postgres/base'

export class PostgreSQLProxy extends PostgresBaseDataSource {
  #url: string = ''

  getEngine(): DatabaseEngine {
    return DatabaseEngine.PostgreSQLProxy
  }

  async init() {
    this.setStatus(DataSourceStatus.Pending)
    this.emit(DataSourceEvent.Initializing)
    this.#url =
      prompt(
        'Please enter postgres connection string',
        'postgres://postgres:postgres@localhost:5432/postgres',
      ) ?? 'postgres://postgres:postgres@localhost:5432/postgres'
    this.logger.log(`Will connect to "${this.#url}" when query is run.`)
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
      url: this.#url,
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
