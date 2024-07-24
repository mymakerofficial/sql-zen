import {
  DatabaseEngineMode,
  DataSourceFacade,
  type QueryResult,
} from '@/lib/databases/database'
import type { Database as SqliteWasmDatabase, Sqlite3Static } from '@sqlite.org/sqlite-wasm'
import { DatabaseEngine } from '@/lib/databaseEngines'
import { DatabaseNotLoadedError } from '@/lib/errors'

function runPromised<TResult>(block: () => TResult): Promise<TResult> {
  return new Promise((resolve, reject) => {
    try {
      resolve(block())
    } catch (e) {
      reject(e)
    }
  })
}

export class SQLite extends DataSourceFacade {
  private sqlite3: Sqlite3Static | null = null
  private database: SqliteWasmDatabase | null = null

  readonly engine = DatabaseEngine.SQLite

  async init() {
    if (this.database) {
      return
    }

    if (this.mode === DatabaseEngineMode.BrowserPersisted && this.identifier) {
      throw new Error(`SQLite persisted databases do not support identifiers`)
    }

    const loadStep = this.logger.step('Loading SQLite3')
    const { default: sqlite3InitModule } = await import(
      '@sqlite.org/sqlite-wasm'
    )
    loadStep.success()
    const initStep = this.logger.step('Initializing SQLite3')
    this.sqlite3 = await sqlite3InitModule({
      print: console.log,
      printErr: console.error,
    })
    initStep.success()
    this.logger.log(`Running SQLite3 version: ${this.sqlite3.version.libVersion}`)
    const openStep = this.logger.step('Creating Database')
    if (this.mode === DatabaseEngineMode.Memory) {
      this.database = new this.sqlite3.oo1.DB(`/${this.identifier}.sqlite3`, 'c')
    } else if (this.mode === DatabaseEngineMode.BrowserPersisted) {
      this.database = new this.sqlite3.oo1.JsStorageDb('local')
    }
    openStep.success()
  }

  async query(sql: string): Promise<QueryResult> {
    return runPromised(() => {
      if (!this.database) {
        throw new DatabaseNotLoadedError()
      }

      const { success, error } = this.logger.query(sql)
      try {
        const res = this.database.exec(sql, {
          rowMode: 'object',
          returnValue: 'resultRows',
        }) as QueryResult
        return success(res)
      } catch (e) {
        throw error(e as Error)
      }
    })
  }

  async dump() {
    return runPromised(() => {
      if (!this.database || !this.sqlite3) {
        throw new DatabaseNotLoadedError()
      }

      const data = this.sqlite3.capi.sqlite3_js_db_export(this.database)
      const blob = new Blob([data], { type: 'application/x-sqlite3' })
      return { blob, filename: `${this.identifier}.sqlite3` }
    })
  }

  async close(): Promise<void> {
    return runPromised(() => {
      if (this.database) {
        this.database.close()
      }
    })
  }
}
