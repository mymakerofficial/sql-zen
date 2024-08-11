import type {
  Database as SqliteWasmDatabase,
  Sqlite3Static,
} from '@sqlite.org/sqlite-wasm'
import { DataSourceMode, DataSourceStatus } from '@/lib/dataSources/enums'
import type { QueryResult } from '@/lib/queries/interface'
import { DatabaseNotLoadedError } from '@/lib/errors'
import { getId } from '@/lib/getId'
import { FileAccessor } from '@/lib/files/fileAccessor'
import { DataSource } from '@/lib/dataSources/impl/base'
import { runPromised } from '@/lib/runPromised'
import { DatabaseEngine } from '@/lib/engines/enums'
import { DataSourceEvent } from '@/lib/dataSources/events'

export class SQLite extends DataSource {
  #sqlite3: Sqlite3Static | null = null
  #database: SqliteWasmDatabase | null = null

  getEngine(): DatabaseEngine {
    return DatabaseEngine.SQLite
  }

  async init() {
    if (this.#database) {
      return
    }

    this.setStatus(DataSourceStatus.Pending)
    this.emit(DataSourceEvent.Initializing)

    if (
      this.getMode() === DataSourceMode.BrowserPersisted &&
      this.getIdentifier()
    ) {
      throw new Error(`SQLite persisted databases do not support identifiers`)
    }

    const sqlite3InitModule = await this.logger.step(
      'Loading SQLite3',
      async () => {
        return (await import('@sqlite.org/sqlite-wasm')).default
      },
    )

    this.#sqlite3 = await this.logger.step('Initializing SQLite3', async () => {
      return sqlite3InitModule({
        print: console.log,
        printErr: console.error,
      })
    })

    const version = this.#sqlite3.version.libVersion
    this.logger.log(`Running SQLite3 version: ${version}`)

    this.#database = await this.logger.step('Creating Database', async () => {
      if (this.getMode() === DataSourceMode.BrowserPersisted) {
        return new this.#sqlite3!.oo1.JsStorageDb('local')
      } else {
        return new this.#sqlite3!.oo1.DB(
          `/${this.getIdentifier()}.sqlite3`,
          'c',
        )
      }
    })

    if (this.getInitDump()) {
      await this.logger.step('Importing Database File', async () => {
        const arrayBuffer = await this.getInitDump()!.readArrayBuffer()
        const bufferPointer =
          this.#sqlite3!.wasm.allocFromTypedArray(arrayBuffer)
        this.#sqlite3!.capi.sqlite3_deserialize(
          this.#database!,
          'main',
          bufferPointer,
          arrayBuffer.byteLength,
          arrayBuffer.byteLength,
          this.#sqlite3!.capi.SQLITE_DESERIALIZE_FREEONCLOSE,
        )
      })
    }

    this.setStatus(DataSourceStatus.Running)
    this.emit(DataSourceEvent.Initialized)
  }

  query<T extends object = object>(sql: string): Promise<QueryResult<T>> {
    return this.logger.query(sql, async () => {
      if (!this.#database) {
        throw new DatabaseNotLoadedError()
      }

      const start = performance.now()
      const row = this.#database.exec(sql, {
        rowMode: 'object',
        returnValue: 'resultRows',
      })
      const end = performance.now()
      return {
        rows: row,
        affectedRows: null,
        duration: end - start,
        id: getId('result'),
      } as QueryResult<T>
    })
  }

  async dump() {
    return runPromised(() => {
      if (!this.#database || !this.#sqlite3) {
        throw new DatabaseNotLoadedError()
      }

      const data = this.#sqlite3.capi.sqlite3_js_db_export(this.#database)
      this.logger.log(`Created database dump: ${data.byteLength} bytes`)
      return FileAccessor.fromUint8Array(
        data,
        `${this.getIdentifier() ?? 'database'}.sqlite3`,
      )
    })
  }

  async close(): Promise<void> {
    return runPromised(() => {
      this.emit(DataSourceEvent.Closing)
      if (this.#database) {
        this.#database.close()
      }
      this.setStatus(DataSourceStatus.Stopped)
      this.emit(DataSourceEvent.Closed)
    })
  }
}
