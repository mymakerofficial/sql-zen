import {
  DatabaseEngineMode,
  DataSourceFacade,
  type QueryResult,
} from '@/lib/databases/database'
import type {
  Database as SqliteWasmDatabase,
  Sqlite3Static,
} from '@sqlite.org/sqlite-wasm'
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

    const sqlite3InitModule = await this.logger.step(
      'Loading SQLite3',
      async () => {
        return (await import('@sqlite.org/sqlite-wasm')).default
      },
    )

    this.sqlite3 = await this.logger.step('Initializing SQLite3', async () => {
      return sqlite3InitModule({
        print: console.log,
        printErr: console.error,
      })
    })

    const version = this.sqlite3.version.libVersion
    this.logger.log(`Running SQLite3 version: ${version}`)

    this.database = await this.logger.step('Creating Database', async () => {
      if (this.mode === DatabaseEngineMode.BrowserPersisted) {
        return new this.sqlite3!.oo1.JsStorageDb('local')
      }
      return new this.sqlite3!.oo1.DB(`/${this.identifier}.sqlite3`, 'c')
    })

    if (!this.fileAccessor) {
      return
    }
    await this.logger.step('Importing Database File', async () => {
      const blob = await this.fileAccessor!.read()
      const arrayBuffer = await blob.arrayBuffer()
      const bufferPointer = this.sqlite3!.wasm.allocFromTypedArray(arrayBuffer)
      this.sqlite3!.capi.sqlite3_deserialize(
        this.database!,
        'main',
        bufferPointer,
        arrayBuffer.byteLength,
        arrayBuffer.byteLength,
        this.sqlite3!.capi.SQLITE_DESERIALIZE_FREEONCLOSE,
      )
    })
  }

  query<T = Object>(sql: string): Promise<QueryResult<T>> {
    return this.logger.query<T>(sql, async () => {
      if (!this.database) {
        throw new DatabaseNotLoadedError()
      }

      return this.database.exec(sql, {
        rowMode: 'object',
        returnValue: 'resultRows',
      }) as QueryResult<T>
    })
  }

  async dump() {
    return runPromised(() => {
      if (!this.database || !this.sqlite3) {
        throw new DatabaseNotLoadedError()
      }

      const data = this.sqlite3.capi.sqlite3_js_db_export(this.database)
      const blob = new Blob([data], { type: 'application/x-sqlite3' })
      this.logger.log(`Created database dump: ${blob.size} bytes`)
      return { blob, filename: `${this.identifier ?? 'database'}.sqlite3` }
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
