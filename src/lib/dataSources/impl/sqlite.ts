import type { QueryResult } from '@/lib/queries/interface'
import { getId } from '@/lib/getId'
import { DataSource } from '@/lib/dataSources/impl/base'
import { DataSourceDriver } from '@/lib/engines/enums'
import { DataSourceStatus } from '@/lib/dataSources/enums'
import { DataSourceEvent } from '@/lib/dataSources/events'
import { invoke } from '@tauri-apps/api/core'
import type { PostgresQueryResult } from '@/lib/dataSources/impl/postgres/base'
import { FieldDefinition } from '@/lib/schema/columns/column'

export class SQLiteDataSource extends DataSource {
  get driver() {
    return DataSourceDriver.SQLite
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

    this.setStatus(DataSourceStatus.Running)
    this.emit(DataSourceEvent.Initialized)

    const { rows } = await this.queryRaw<{
      database: string
      version: string
    }>("SELECT database() AS 'database', version() AS 'version'")

    this.logger.log(`Connected to MySQL version: ${rows[0].version}`)
    this.logger.log(`Current database: ${rows[0].database}`)
  }

  async queryRaw<T extends object = object>(
    sql: string,
  ): Promise<PostgresQueryResult<T>> {
    const res = await invoke<{
      columns: { name: string; dataTypeID: number }[]
      rows: string[][]
    }>('query', {
      key: this.key,
      sql,
    }).catch((e) => {
      throw new Error(e)
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

  query<T extends object = object>(sql: string) {
    return this.logger.query(sql, async () => {
      const start = performance.now()
      const rawResponse = await this.queryRaw<T>(sql)
      const end = performance.now()

      const fields = rawResponse.fields.map((field) => {
        return FieldDefinition.fromUnknown(field.name).toFieldInfo()
      })

      return {
        fields,
        rows: rawResponse.rows,
        affectedRows: null,
        duration: end - start,
        systemDuration: 0,
        id: getId('result'),
      } as QueryResult<T>
    })
  }
}
