import type { PGlite } from '@electric-sql/pglite'
import { DatabaseNotLoadedError } from '@/lib/errors'
import { DataSourceMode } from '@/lib/dataSources/enums'
import type { QueryResult } from '@/lib/queries/interface'
import { getId } from '@/lib/getId'
import { FileAccessor } from '@/lib/files/fileAccessor'
import { DataSource } from '@/lib/dataSources/impl/base'
import { vector } from '@electric-sql/pglite/vector'
import type { FileInfo } from '@/lib/files/interface'

const BASE_PATH = '/var'

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
      const loadDataDir = await this.initDump?.readBlob()
      const database = new module.PGlite(this.#getDataDir(), {
        loadDataDir,
        extensions: {
          vector,
        },
      })
      await database.waitReady

      // Create the base directory for user files
      database.Module.FS.mkdir(BASE_PATH)

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

  async getFiles() {
    if (!this.#database) {
      throw new DatabaseNotLoadedError()
    }

    return readDirectory(this.#database.Module.FS, BASE_PATH)
  }

  async readFile(path: string) {
    if (!this.#database) {
      throw new DatabaseNotLoadedError()
    }

    const fs = this.#database.Module.FS
    const stats = fs.stat(path)
    if (!fs.isFile(stats.mode)) {
      throw new Error('Provided path is not a file')
    }
    const arrayBuffer = fs.readFile(path, { encoding: 'binary' })
    const fileName = path.split('/').pop() ?? ''
    return FileAccessor.fromUint8Array(arrayBuffer, fileName)
  }

  async writeFile(path: string, fileAccessor: FileAccessor) {
    if (!this.#database) {
      throw new DatabaseNotLoadedError()
    }

    const fs = this.#database.Module.FS
    const fullPath = `${BASE_PATH}/${path}`
    const stream = fs.open(fullPath, 'w+')
    const arrayBuffer = await fileAccessor.readUint8Array()
    const fileSize = await fileAccessor.getSize()
    fs.write(stream, arrayBuffer, 0, fileSize ?? 0, 0)
    fs.close(stream)
  }

  async deleteFile(path: string): Promise<void> {
    if (!this.#database) {
      throw new DatabaseNotLoadedError()
    }

    const fs = this.#database.Module.FS
    fs.unlink(path)
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

function readDirectory(fs: PGlite['Module']['FS'], path: string) {
  const files: FileInfo[] = []

  const traverseDirectory = (currentPath: string) => {
    const entries: string[] = fs.readdir(currentPath)
    entries.forEach((entry) => {
      if (entry === '.' || entry === '..') {
        return
      }
      const fullPath = currentPath + '/' + entry
      const stats = fs.stat(fullPath)
      files.push({
        path: fullPath,
        size: stats.size,
      })
      if (fs.isDir(stats.mode)) {
        traverseDirectory(fullPath)
      }
    })
  }

  traverseDirectory(path)
  return files
}
