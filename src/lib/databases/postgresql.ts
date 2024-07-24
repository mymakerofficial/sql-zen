import {
  DatabaseEngineMode,
  DatabaseFacade,
  type QueryResult,
} from '@/lib/databases/database'
import type { PGlite, Results } from '@electric-sql/pglite'
import { DatabaseNotLoadedError } from '@/lib/errors'
import { DatabaseEngine } from '@/lib/databaseEngines'

export class PostgreSQL extends DatabaseFacade {
  private database: PGlite | null = null

  readonly engine = DatabaseEngine.PostgreSQL

  private getDataDir() {
    if (this.mode === DatabaseEngineMode.Memory) {
      return `memory://${this.identifier}`
    } else if (this.mode === DatabaseEngineMode.BrowserPersisted) {
      return `idb://${this.identifier}`
    }
  }

  async init() {
    if (this.database) {
      return
    }

    const initStep = this.logger.step('Loading PostgreSQL')
    const module = await import('@electric-sql/pglite')
    this.database = new module.PGlite(this.getDataDir())
    await this.database.waitReady
    initStep.success()
    const version = await this.database.query<{ version: string }>(
      'SELECT version()',
    )
    this.logger.log(`Running PostgreSQL version: ${version.rows[0]?.version}`)
  }

  private parseRawResponse(rawResult: Results<unknown>): QueryResult {
    return rawResult.rows as QueryResult
  }

  async query(sql: string) {
    if (!this.database) {
      throw new DatabaseNotLoadedError()
    }

    const { success, error } = this.logger.query(sql)
    try {
      const rawResponse = await this.database.query(sql)
      const result = this.parseRawResponse(rawResponse)
      return success(result)
    } catch (e) {
      throw error(e as Error)
    }
  }

  async dump() {
    if (!this.database) {
      throw new DatabaseNotLoadedError()
    }

    const data = await this.database.dumpDataDir();
    const blob = new Blob([data], { type: 'application/x-gzip' })
    return { blob, filename: `${this.identifier}.tar.gz` }
  }

  async close() {
    if (this.database) {
      await this.database.close()
    }
  }
}
