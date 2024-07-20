import type * as duckdb from '@duckdb/duckdb-wasm'
import { arrowToResultArray } from '@/lib/arrowToResultArray'
import type { DatabaseFacade } from '@/lib/database'

let worker: Worker | null = null
let database: duckdb.AsyncDuckDB | null = null
let connection: duckdb.AsyncDuckDBConnection | null = null

export function useDuckdb() {
  async function init() {
    if (connection) {
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
    worker = new Worker(bundle.mainWorker!)
    const logger = new duckdb.ConsoleLogger()
    database = new duckdb.AsyncDuckDB(logger, worker)
    await database.instantiate(bundle.mainModule, bundle.pthreadWorker)
    console.debug('DuckDB version:', await database.getVersion())
    connection = await database.connect()
  }

  async function query(sql: string) {
    if (!connection) {
      throw new Error('DuckDB not loaded')
    }

    const arrowResult = await connection.query(sql)
    return arrowToResultArray(arrowResult)
  }

  async function close() {
    if (connection) {
      await connection.close()
      connection = null
    }
    if (database) {
      await database.terminate()
      database = null
    }
    if (worker) {
      worker.terminate()
      worker = null
    }
  }

  return { init, query, close } satisfies DatabaseFacade
}
