import { DatabaseEngineMode, DatabaseFacade } from '@/lib/databases/database'
import { arrowToResultArray } from '@/lib/arrowToResultArray'
import type * as duckdb from '@duckdb/duckdb-wasm'
import { DatabaseNotLoadedError } from '@/lib/errors'
import { DatabaseEngine } from '@/lib/databaseEngines'

export class DuckDB extends DatabaseFacade {
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

    const loadBundlesStep = this.logger.step('Loading DuckDB bundles')
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
    loadBundlesStep.success()
    const selectingBundleStep = this.logger.step('Selecting DuckDB bundle')
    const bundle = await duckdb.selectBundle({
      mvp: {
        mainModule: duckdb_wasm,
        mainWorker: mvp_worker,
      },
      eh: {
        mainModule: duckdb_wasm_eh,
        mainWorker: eh_worker,
      },
    })
    selectingBundleStep.success()
    const instantiateWorkerStep = this.logger.step('Instantiating Worker')
    this.worker = new Worker(bundle.mainWorker!)
    instantiateWorkerStep.success()
    const instantiateDatabaseStep = this.logger.step('Instantiating Database')
    const duckDbLogger = new duckdb.ConsoleLogger()
    this.database = new duckdb.AsyncDuckDB(duckDbLogger, this.worker)
    await this.database.instantiate(bundle.mainModule, bundle.pthreadWorker)
    instantiateDatabaseStep.success()
    const version = await this.database.getVersion()
    this.logger.log(`Running DuckDB version: ${version}`)
    const connectStep = this.logger.step('Connecting to Database')
    this.connection = await this.database.connect()
    connectStep.success()
  }

  async query(sql: string) {
    if (!this.connection) {
      throw new DatabaseNotLoadedError()
    }

    const { success, error } = this.logger.query(sql)
    try {
      const arrowResult = await this.connection.query(sql)
      const result = arrowToResultArray(arrowResult)
      return success(result)
    } catch (e) {
      throw error(e as Error)
    }
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
