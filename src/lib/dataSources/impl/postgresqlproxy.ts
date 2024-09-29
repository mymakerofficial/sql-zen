import { DataSource } from '@/lib/dataSources/impl/base'
import { DatabaseEngine } from '@/lib/engines/enums'
import { DataSourceStatus } from '@/lib/dataSources/enums'
import { DataSourceEvent } from '@/lib/dataSources/events'
import { getId } from '@/lib/getId'
import type { QueryResult } from '@/lib/queries/interface'
import { invoke } from '@tauri-apps/api/core'
import { FieldDefinition } from '@/lib/schema/columns/column'
import { PseudoDataType } from '@/lib/schema/columns/types/base'

export class PostgreSQLProxy extends DataSource {
  #params: string = ''

  getEngine(): DatabaseEngine {
    return DatabaseEngine.PostgreSQLProxy
  }

  isInitialized(): boolean {
    return true
  }

  async init() {
    this.setStatus(DataSourceStatus.Pending)
    this.emit(DataSourceEvent.Initializing)
    this.#params =
      prompt(
        'Please enter postgres connection string',
        'postgres://postgres:postgres@localhost:5432/postgres',
      ) ?? 'postgres://postgres:postgres@localhost:5432/postgres'
    this.logger.log(`Will connect to "${this.#params}" when query is run.`)
    this.setStatus(DataSourceStatus.Running)
    this.emit(DataSourceEvent.Initialized)
  }

  query<T extends object = object>(sql: string) {
    return this.logger.query(sql, async () => {
      const start = performance.now()
      const res: {
        columns: { name: string; typeId: number }[]
        rows: string[][]
      } = await invoke('run_query', {
        sql,
        params: this.#params,
      })
      const end = performance.now()

      const fields = res.columns.map(({ name, typeId }) =>
        FieldDefinition.createPostgresType({
          dataType: PseudoDataType.Unknown,
          typeName: typeId.toString(),
        })
          .toField({ name })
          .toFieldInfo(),
      )
      const rows = res.rows.map((row) => {
        const obj: Record<string, string> = {}
        fields.forEach((field, i) => {
          obj[field.name] = row[i]
        })
        return obj as T
      })
      console.log(res, fields, rows)

      return {
        fields,
        rows,
        affectedRows: null,
        duration: end - start,
        systemDuration: 0,
        id: getId('result'),
      } as QueryResult<T>
    })
  }
}
