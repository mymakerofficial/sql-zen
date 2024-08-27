import type { PGliteInterface } from '@electric-sql/pglite'
import { DatabaseNotLoadedError } from '@/lib/errors'
import { DataSourceMode, DataSourceStatus } from '@/lib/dataSources/enums'
import type { QueryResult } from '@/lib/queries/interface'
import { getId } from '@/lib/getId'
import { FileAccessor } from '@/lib/files/fileAccessor'
import { DataSource } from '@/lib/dataSources/impl/base'
import type { FileInfo } from '@/lib/files/interface'
import { DatabaseEngine } from '@/lib/engines/enums'
import { DataSourceEvent } from '@/lib/dataSources/events'
import { PostgreSQLColumnDefinition } from '@/lib/schema/columns/definition/postgresql'
import { PGliteWorkerFS } from '@/lib/dataSources/impl/lib/PGliteWorkerFS'

const BASE_PATH = '/var'

export class PostgreSQL extends DataSource {
  #worker: Worker | null = null
  #fs: PGliteWorkerFS | null = null
  #database: PGliteInterface | null = null
  #types: Map<number, string> = new Map()

  getEngine(): DatabaseEngine {
    return DatabaseEngine.PostgreSQL
  }

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

  async init() {
    if (this.#database) {
      return
    }

    this.setStatus(DataSourceStatus.Pending)
    this.emit(DataSourceEvent.Initializing)

    await this.logger.step('Creating Worker', async () => {
      this.#worker = new Worker(
        new URL('./lib/pglite-worker.ts', import.meta.url),
        {
          type: 'module',
        },
      )

      this.#fs = new PGliteWorkerFS(this.#worker)
    })

    const { PGliteWorker } = await this.logger.step(
      'Importing Module',
      async () => {
        return await import('@electric-sql/pglite/worker')
      },
    )

    this.#database = await this.logger.step('Loading PostgreSQL', async () => {
      if (!this.#worker) {
        throw new Error('Worker does not exist')
      }

      const dataDir = this.#getDataDir()
      const loadDataDir = await this.getInitDump()?.readBlob()

      const database = await PGliteWorker.create(this.#worker, {
        dataDir,
        loadDataDir,
      })

      await database.exec('SELECT 1')

      return database
    })

    await this.logger.step('Creating Directories', async () => {
      if (!this.#fs) {
        throw new Error('Worker does not exist')
      }

      // Create the base directory for user files
      await this.#fs.launch('mkdir', BASE_PATH)
    })

    const version = await this.#getVersion()
    this.logger.log(`Running PostgreSQL version: ${version}`)

    this.setStatus(DataSourceStatus.Running)
    this.emit(DataSourceEvent.Initialized)
  }

  query<T extends object = object>(sql: string): Promise<QueryResult<T>> {
    return this.logger.query(sql, async () => {
      if (!this.#database) {
        throw new DatabaseNotLoadedError()
      }

      const start = performance.now()
      const rawResponse = await this.#database.query<T>(sql)
      const end = performance.now()

      await this.fetchOIDs(rawResponse.fields.map((field) => field.dataTypeID))
      const fields = rawResponse.fields.map((field) =>
        PostgreSQLColumnDefinition.fromNameAndUDTName(
          field.name,
          this.getUDTByOID(field.dataTypeID),
        ).toFieldInfo(),
      )

      return {
        fields,
        rows: rawResponse.rows,
        affectedRows: rawResponse.affectedRows,
        duration: end - start,
        id: getId('result'),
      } as QueryResult<T>
    })
  }

  // returns the type name for the given OID
  //  be sure to call fetchOIDs first
  getUDTByOID(oid: number) {
    return this.#types.get(oid) ?? ''
  }

  // Fetches the type names for the given OIDs and caches them
  async fetchOIDs(oids: number[]) {
    if (!this.#database) {
      throw new DatabaseNotLoadedError()
    }

    const distinctOIDs = [...new Set(oids)]
    const missingOIDs = distinctOIDs.filter((oid) => !this.#types.has(oid))

    if (!missingOIDs.length) {
      return
    }

    const { rows } = await this.#database.query<{
      oid: number
      typname: string
    }>(`SELECT oid, typname FROM pg_catalog.pg_type WHERE oid = ANY($1)`, [
      missingOIDs,
    ])

    for (const row of rows) {
      this.#types.set(row.oid, row.typname)
    }
  }

  async getFiles() {
    if (!this.#fs) {
      throw new DatabaseNotLoadedError()
    }

    return await readDirectory(this.#fs, BASE_PATH)
  }

  async readFile(path: string) {
    if (!this.#fs) {
      throw new DatabaseNotLoadedError()
    }

    const stats = await this.#fs.run('stat', path)
    if (!(await this.#fs.run('isFile', stats.mode))) {
      throw new Error('Provided path is not a file')
    }
    const arrayBuffer = await this.#fs.run('readFile', path, {
      encoding: 'binary',
    })
    const fileName = path.split('/').pop() ?? ''
    return FileAccessor.fromUint8Array(arrayBuffer, fileName)
  }

  async writeFile(path: string, fileAccessor: FileAccessor) {
    if (!this.#fs) {
      throw new DatabaseNotLoadedError()
    }

    const fullPath = `${BASE_PATH}/${path}`
    const arrayBuffer = await fileAccessor.readUint8Array()
    await this.#fs.launch('writeFile', fullPath, arrayBuffer, {
      flags: 'w+',
    })
  }

  async deleteFile(path: string): Promise<void> {
    if (!this.#fs) {
      throw new DatabaseNotLoadedError()
    }

    await this.#fs.launch('unlink', path)
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
    this.emit(DataSourceEvent.Closing)
    if (this.#database) {
      await this.#database.close()
    }
    this.setStatus(DataSourceStatus.Stopped)
    this.emit(DataSourceEvent.Closed)
  }
}

async function readDirectory(fs: PGliteWorkerFS, path: string) {
  const files: FileInfo[] = []

  async function traverseDirectory(currentPath: string) {
    const entries: string[] = await fs.run('readdir', currentPath)
    for (const entry of entries) {
      if (entry === '.' || entry === '..') {
        continue
      }
      const fullPath = currentPath + '/' + entry
      const stats = await fs.run('stat', fullPath)
      files.push({
        path: fullPath,
        size: stats.size,
      })
      if (await fs.run('isDir', stats.mode)) {
        await traverseDirectory(fullPath)
      }
    }
  }

  await traverseDirectory(path)
  return files
}
