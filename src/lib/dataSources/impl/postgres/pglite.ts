import type { PGliteInterface } from '@electric-sql/pglite'
import { DatabaseNotLoadedError } from '@/lib/errors'
import { DataSourceMode, DataSourceStatus } from '@/lib/dataSources/enums'
import { FileAccessor } from '@/lib/files/fileAccessor'
import type { FileInfo } from '@/lib/files/interface'
import { DatabaseEngine, DataSourceDriver } from '@/lib/engines/enums'
import { DataSourceEvent } from '@/lib/dataSources/events'
import { PGliteWorkerFS } from '@/lib/dataSources/impl/postgres/lib/PGliteWorkerFS'
import {
  PostgresDataSource,
  type PostgresQueryResult,
} from '@/lib/dataSources/impl/postgres/base'
import type { DataSourceInfo } from '@/lib/dataSources/types'

const BASE_PATH = '/var'
const TO_STRING = (value: string) => value

export class PGLiteDataSource extends PostgresDataSource {
  #worker: Worker | null = null
  #fs: PGliteWorkerFS | null = null
  #database: PGliteInterface | null = null

  get engine() {
    return DatabaseEngine.PostgreSQL
  }

  get driver() {
    return DataSourceDriver.PGLite
  }

  async init() {
    if (this.#database) {
      return
    }
    this.#worker = null
    this.#fs = null

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

      const dataDir = getDataDir(this.getInfo())
      const loadDataDir = await this.fileAccessor.getOrUndefined()?.readBlob()

      const pglitePromise = PGliteWorker.create(this.#worker, {
        dataDir,
        loadDataDir,
      }).then(async (pglite) => {
        await pglite.waitReady
        return pglite
      })

      const timeout = setTimeout(() => {
        this.logger.log(
          'Loading Postgres is taking longer than expected. You may need to refresh the page.',
        )
      }, 15000)

      return await pglitePromise.finally(() => {
        clearTimeout(timeout)
      })
    })

    await this.logger.step('Creating Directories', async () => {
      if (!this.#fs) {
        throw new Error('Worker does not exist')
      }

      // Create the base directory for user files
      await this.#fs.mkdir(BASE_PATH)
    })

    this.setStatus(DataSourceStatus.Running)
    this.emit(DataSourceEvent.Initialized)
  }

  async queryRaw<T extends object = object>(
    sql: string,
  ): Promise<PostgresQueryResult<T>> {
    if (!this.#database) {
      throw new DatabaseNotLoadedError()
    }

    // PGLite always tries to parse values. We want to keep them as strings.
    // Maybe in the future we just parse the postgres messages ourselves
    // @ts-expect-error - PGLite does not expose parsers
    this.#database.parsers = Object.keys(this.#database.parsers).reduce(
      (acc, key) => {
        // @ts-expect-error
        acc[key] = TO_STRING
        return acc
      },
      {},
    )

    return await this.#database.query<T>(sql, [])
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

    const stats = await this.#fs.stat(path)
    const isFile = await this.#fs.isFile(stats.mode)
    if (!isFile) {
      throw new Error('Provided path is not a file')
    }
    const arrayBuffer = await this.#fs.readFile(path, {
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
    await this.#fs.writeFile(fullPath, arrayBuffer, {
      flags: 'w+',
    })
  }

  async deleteFile(path: string): Promise<void> {
    if (!this.#fs) {
      throw new DatabaseNotLoadedError()
    }

    await this.#fs.unlink(path)
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
      // TODO: store file name with datasource
      `database.tar.gz`,
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
    const entries: string[] = await fs.readdir(currentPath)
    for (const entry of entries) {
      if (entry === '.' || entry === '..') {
        continue
      }

      const fullPath = currentPath + '/' + entry
      const stats = await fs.stat(fullPath)
      const isDir = await fs.isDir(stats.mode)

      files.push({
        path: fullPath,
        size: stats.size,
      })

      if (isDir) {
        await traverseDirectory(fullPath)
      }
    }
  }

  await traverseDirectory(path)
  return files
}

function getDataDir(info: DataSourceInfo) {
  if (info.mode === DataSourceMode.BrowserPersisted) {
    return `idb://${info.identifier}`
  } else {
    return `memory://${info.identifier}`
  }
}