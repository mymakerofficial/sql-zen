import type { DatabaseFacade, QueryResult } from '@/lib/database'
import { type Database as SqliteDatabase } from '@sqlite.org/sqlite-wasm'

let database: SqliteDatabase | null = null

export function useSqlite() {
  async function init() {
    if (database) {
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
    database = new sqlite3.oo1.DB('/mydb.sqlite3', 'ct')
    console.debug('SQLite3 database initialized')
  }

  async function query(sql: string): Promise<QueryResult> {
    return new Promise((resolve) => {
      if (!database) {
        throw new Error('SQLite3 not loaded')
      }

      const res = database.exec(sql, {
        rowMode: 'object',
        returnValue: 'resultRows',
      }) as QueryResult

      resolve(res)
    })
  }

  async function close(): Promise<void> {
    return new Promise((resolve) => {
      if (database) {
        database.close()
        database = null
      }

      resolve()
    })
  }

  return { init, query, close } satisfies DatabaseFacade
}
