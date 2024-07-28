import type { PGlite } from '@electric-sql/pglite'
import { DatabaseNotLoadedError } from '@/lib/errors'
import { DataSourceMode } from '@/lib/dataSources/enums'
import type { QueryResult } from '@/lib/queries/interface'
import { getId } from '@/lib/getId'
import { FileAccessor } from '@/lib/files/fileAccessor'
import { DataSource } from '@/lib/dataSources/impl/base'

export class PostgreSQL extends DataSource {
  #database: PGlite | null = null

  #getDataDir() {
    if (this.getMode() === DataSourceMode.Memory) {
      return `memory://${this.getIdentifier()}`
    } else if (this.getMode() === DataSourceMode.BrowserPersisted) {
      return `idb://${this.getIdentifier()}`
    }
  }

  async #getVersion() {
    if (!this.#database) {
      throw new DatabaseNotLoadedError()
    }

    const { rows } = await this.#database.query<{ version: string }>(
      'SELECT version()',
    )
    return rows[0]?.version
  }

  isInitialized(): boolean {
    return this.#database !== null
  }

  async init() {
    if (this.#database) {
      return
    }

    this.#database = await this.logger.step('Loading PostgreSQL', async () => {
      const module = await import('@electric-sql/pglite')
      const loadDataDir = await this.initDump?.read()
      const database = new module.PGlite(this.#getDataDir(), {
        loadDataDir,
      })
      await database.waitReady
      return database
    })

    const version = await this.#getVersion()
    this.logger.log(`Running PostgreSQL version: ${version}`)
  }

  query<T extends object = object>(sql: string): Promise<QueryResult<T>> {
    return this.logger.query(sql, async () => {
      if (!this.#database) {
        throw new DatabaseNotLoadedError()
      }

      const start = performance.now()
      const rawResponse = await this.#database.query<T>(sql)
      const end = performance.now()
      return {
        rows: rawResponse.rows,
        affectedRows: rawResponse.affectedRows,
        duration: end - start,
        id: getId('result'),
      } as QueryResult<T>
    })
  }

  async dump() {
    if (!this.#database) {
      throw new DatabaseNotLoadedError()
    }

    const data = await this.#database.dumpDataDir()
    const blob = new Blob([data], { type: 'application/x-gzip' })
    this.logger.log(`Created database dump: ${blob.size} bytes`)
    return FileAccessor.fromBlob(
      blob,
      `${this.getIdentifier() ?? 'database'}.tar.gz`,
    )
  }

  async close() {
    if (this.#database) {
      await this.#database.close()
    }
  }
}
