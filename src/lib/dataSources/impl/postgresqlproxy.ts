import { DataSource } from '@/lib/dataSources/impl/base'
import { DatabaseEngine } from '@/lib/engines/enums'
import { DataSourceStatus } from '@/lib/dataSources/enums'
import { DataSourceEvent } from '@/lib/dataSources/events'
import { getId } from '@/lib/getId'
import type { QueryResult } from '@/lib/queries/interface'
import { invoke } from '@tauri-apps/api/core'

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
        'host=localhost user=postgres password=postgres',
      ) ?? 'host=localhost user=postgres password=postgres'
    this.logger.log(`Will connect to "${this.#params}" when query is run.`)
    this.setStatus(DataSourceStatus.Running)
    this.emit(DataSourceEvent.Initialized)
  }

  query<T extends object = object>(sql: string) {
    return this.logger.query(sql, async () => {
      const start = performance.now()

      const res: {
        rows: Array<Array<Array<number>>>
      } = await invoke('run_query', { sql, params: this.#params })

      res.rows.forEach((row) => {
        row.forEach((cell) => {
          new Blob([Uint8Array.from(cell)])
            .text()
            .then((it) => this.logger.log(it))
        })
      })

      // @ts-expect-error
      this.logger.log(res.rows)

      const end = performance.now()

      return {
        fields: [],
        rows: [],
        affectedRows: null,
        duration: end - start,
        systemDuration: 0,
        id: getId('result'),
      } as QueryResult<T>
    })
  }
}
