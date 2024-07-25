import {
  DatabaseEngineMode,
  DataSourceFacade,
  type QueryResult,
} from '@/lib/databases/database'
import { arrowToResultArray } from '@/lib/arrowToResultArray'
import type * as duckdb from '@duckdb/duckdb-wasm'
import { DatabaseNotLoadedError } from '@/lib/errors'
import { DatabaseEngine } from '@/lib/databaseEngines'

export class DuckDB extends DataSourceFacade {
  private worker: Worker | null = null
  private database: duckdb.AsyncDuckDB | null = null
  private connection: duckdb.AsyncDuckDBConnection | null = null

  readonly engine = DatabaseEngine.DuckDB

  async init() {
    if (this.connection) {
      return
    }

    if (this.mode !== DatabaseEngineMode.Memory) {
      throw new Error(`Unsupported mode for DuckDB: ${this.mode}`)
    }

    if (this.identifier) {
      throw new Error(`DuckDB does not support identifiers`)
    }

    const { duckdb, duckdb_wasm, mvp_worker, duckdb_wasm_eh, eh_worker } =
      await this.logger.step('Loading DuckDB bundles', async () => {
        const duckdb = await import('@duckdb/duckdb-wasm')
        const { default: duckdb_wasm } = await import(
          '@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm?url'
        )
        const { default: mvp_worker } = await import(
          '@duckdb/duckdb-wasm/dist/duckdb-browser-mvp.worker.js?url'
        )
        const { default: duckdb_wasm_eh } = await import(
          '@duckdb/duckdb-wasm/dist/duckdb-eh.wasm?url'
        )
        const { default: eh_worker } = await import(
          '@duckdb/duckdb-wasm/dist/duckdb-browser-eh.worker.js?url'
        )
        return { duckdb, duckdb_wasm, mvp_worker, duckdb_wasm_eh, eh_worker }
      })

    const bundle = await this.logger.step('Selecting DuckDB bundle', () => {
      return duckdb.selectBundle({
        mvp: {
          mainModule: duckdb_wasm,
          mainWorker: mvp_worker,
        },
        eh: {
          mainModule: duckdb_wasm_eh,
          mainWorker: eh_worker,
        },
      })
    })

    this.worker = await this.logger.step('Instantiating Worker', async () => {
      return new Worker(bundle.mainWorker!)
    })

    await this.logger.step('Instantiating DuckDB', async () => {
      const duckDbLogger = new duckdb.ConsoleLogger()
      this.database = new duckdb.AsyncDuckDB(duckDbLogger, this.worker)
      await this.database.instantiate(bundle.mainModule, bundle.pthreadWorker)
      const version = await this.database.getVersion()
      this.logger.log(`Running DuckDB version: ${version}`)
    })

    this.connection = await this.logger.step('Connecting to Database', () => {
      return this.database!.connect()
    })
  }

  query<T = Object>(sql: string): Promise<QueryResult<T>> {
    return this.logger.query<T>(sql, async () => {
      if (!this.connection) {
        throw new DatabaseNotLoadedError()
      }

      const arrowResult = await this.connection.query(sql)
      return arrowToResultArray(arrowResult) as QueryResult<T>
    })
  }

  async dump() {
    throw new Error(`DuckDB does not support dumping`)
    // just to satisfy the interface
    return { blob: new Blob(), filename: '' }
  }

  async close() {
    if (this.connection) {
      await this.connection.close()
    }
    if (this.database) {
      await this.database.terminate()
    }
    if (this.worker) {
      this.worker.terminate()
    }
  }
}
