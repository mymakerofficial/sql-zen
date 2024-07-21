import { DatabaseFacade, type QueryResult } from '@/lib/databases/database'
import type { Database as SqliteDatabase } from '@sqlite.org/sqlite-wasm'

function runPromised<TResult>(block: () => TResult): Promise<TResult> {
  return new Promise((resolve, reject) => {
    try {
      resolve(block())
    } catch (e) {
      reject(e)
    }
  })
}

export class SqliteFacade extends DatabaseFacade {
  private database: SqliteDatabase | null = null

  async init() {
    if (this.database) {
      return
    }

    console.debug('Loading SQLite3')
    const { default: sqlite3InitModule } = await import(
      '@sqlite.org/sqlite-wasm'
    )
    console.debug('Initializing SQLite3')
    const sqlite3 = await sqlite3InitModule({
      print: console.log,
      printErr: console.error,
    })
    console.debug('Running SQLite3 version', sqlite3.version.libVersion)
    this.database = new sqlite3.oo1.DB('/mydb.sqlite3', 'ct')
    console.debug('SQLite3 database initialized')
  }

  async query(sql: string): Promise<QueryResult> {
    return runPromised(() => {
      if (!this.database) {
        throw new Error('SQLite3 not loaded')
      }

      return this.database.exec(sql, {
        rowMode: 'object',
        returnValue: 'resultRows',
      }) as QueryResult
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
