import { DatabaseFacade } from '@/lib/databases/database'
import { arrowToResultArray } from '@/lib/arrowToResultArray'
import type * as duckdb from '@duckdb/duckdb-wasm'
import { DatabaseNotLoadedError } from '@/lib/errors'

export class DuckdbFacade extends DatabaseFacade {
  private worker: Worker | null = null
  private database: duckdb.AsyncDuckDB | null = null
  private connection: duckdb.AsyncDuckDBConnection | null = null

  async init() {
    if (this.connection) {
      return
    }

    // load DuckDB bundles
    console.debug('Loading DuckDB')
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
    // Select a bundle based on browser checks
    console.debug('Selecting DuckDB bundle')
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
    // Instantiate the asynchronus version of DuckDB-wasm
    console.debug('Instantiating DuckDB')
    this.worker = new Worker(bundle.mainWorker!)
    const logger = new duckdb.ConsoleLogger()
    this.database = new duckdb.AsyncDuckDB(logger, this.worker)
    await this.database.instantiate(bundle.mainModule, bundle.pthreadWorker)
    console.debug('DuckDB version:', await this.database.getVersion())
    this.connection = await this.database.connect()
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
