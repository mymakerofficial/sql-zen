import { DatabaseFacade } from '@/lib/databases/database'
import type { PGlite } from '@electric-sql/pglite'
import { DatabaseNotLoadedError } from '@/lib/errors'

export class PostgresqlFacade extends DatabaseFacade {
  private database: PGlite | null = null

  async init() {
    if (this.database) {
      // already initialized
      return
    }

    console.debug('Loading PostgreSQL')
    const module = await import('@electric-sql/pglite')
    console.debug('Initializing PostgreSQL')
    this.database = new module.PGlite()
    // pglite initializes on the first query
    // we don't want this behaviour, so we run a dummy query
    await this.database.exec(`select 1`)
    console.debug('PostgreSQL initialized')
  }

  async query(sql: string) {
    if (!this.database) {
      throw new DatabaseNotLoadedError()
    }

    const res = await this.database.query(sql)
    return res.rows as Array<Object>
  }

  async close() {
    if (this.database) {
      await this.database.close()
    }
  }
}
