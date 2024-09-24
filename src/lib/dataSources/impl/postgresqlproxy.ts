import { DataSource } from '@/lib/dataSources/impl/base'
import { DatabaseEngine } from '@/lib/engines/enums'
import { DataSourceStatus } from '@/lib/dataSources/enums'
import { DataSourceEvent } from '@/lib/dataSources/events'
import { getId } from '@/lib/getId'
import type { QueryResult } from '@/lib/queries/interface'
import Database from '@tauri-apps/plugin-sql'
import { DatabaseNotLoadedError } from '@/lib/errors'
import { FieldDefinition } from '@/lib/schema/columns/column'

export class PostgreSQLProxy extends DataSource {
  #params: string = ''
  #db: Database | null = null

  getEngine(): DatabaseEngine {
    return DatabaseEngine.PostgreSQLProxy
  }

  isInitialized(): boolean {
    return true
  }

  async init() {
    this.setStatus(DataSourceStatus.Pending)
    this.emit(DataSourceEvent.Initializing)
    this.#db = await this.logger.step('Loading Database', async () => {
      return await Database.load(
        'postgres://postgres:postgres@localhost:5432/postgres',
      )
    })
    this.setStatus(DataSourceStatus.Running)
    this.emit(DataSourceEvent.Initialized)
  }

  query<T extends object = object>(sql: string) {
    return this.logger.query(sql, async () => {
      if (!this.#db) {
        throw new DatabaseNotLoadedError()
      }

      const start = performance.now()
      const res = (await this.#db.select(sql)) as {
        [K in string]: unknown
      }[]
      const end = performance.now()

      return {
        fields: Object.entries(res[0]).map(([name]) =>
          FieldDefinition.fromUnknown(name as string).toFieldInfo(),
        ),
        rows: res,
        affectedRows: null,
        duration: end - start,
        systemDuration: 0,
        id: getId('result'),
      } as QueryResult<T>
    })
  }
}
