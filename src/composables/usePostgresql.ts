import type { PGlite } from '@electric-sql/pglite'
import type { DatabaseFacade } from '@/lib/database'

let database: PGlite | null = null

export function usePostgresql() {
  async function init() {
    if (database) {
      return
    }

    console.debug('Loading PostgreSQL')
    const module = await import('@electric-sql/pglite')
    console.debug('Initializing PostgreSQL')
    database = new module.PGlite()
    // pglite initializes on the first query
    // we don't want this behaviour, so we run a dummy query
    await database.exec(`select 1`)
    console.debug('PostgreSQL initialized')
  }

  async function query(sql: string) {
    if (!database) {
      throw new Error('PostgreSQL not loaded')
    }

    const res = await database.exec(sql)
    return res[res.length - 1].rows
  }

  async function close() {
    if (database) {
      await database.close()
      database = null
    }
  }

  return { init, query, close } as DatabaseFacade
}
