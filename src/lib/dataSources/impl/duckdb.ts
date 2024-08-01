import type * as duckdb from '@duckdb/duckdb-wasm'
import { DatabaseNotLoadedError } from '@/lib/errors'
import { FileAccessor } from '@/lib/files/fileAccessor'
import type { Table } from 'apache-arrow'
import { DataSourceMode } from '@/lib/dataSources/enums'
import type { QueryResult } from '@/lib/queries/interface'
import { getId } from '@/lib/getId'
import { DataSource } from '@/lib/dataSources/impl/base'
import type { IDataSource } from '../interface'
import { DuckDBDataProtocol, DuckDBAccessMode } from '@duckdb/duckdb-wasm'

export class DuckDB extends DataSource {
  #worker: Worker | null = null
  #database: duckdb.AsyncDuckDB | null = null
  #connection: duckdb.AsyncDuckDBConnection | null = null

  isInitialized(): boolean {
    return this.#connection !== null
  }

  async init() {
    if (this.#connection) {
      return
    }

    if (this.getMode() !== DataSourceMode.Memory) {
      throw new Error(`Unsupported mode for DuckDB: ${this.getMode()}`)
    }

    if (this.getIdentifier()) {
      throw new Error(`DuckDB does not support identifiers`)
    }

    const { duckdb, duckdb_wasm, mvp_worker, duckdb_wasm_eh, eh_worker } =
      await this.logger.step('Loading DuckDB bundles', async () => {
        const duckdb = await import('@duckdb/duckdb-wasm')
        const { default: duckdb_wasm } = await import(
          '@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm?url'
        )
        const { default: mvp_worker } = await import(
          '@duckdb/duckdb-wasm/dist/duckdb-browser-mvp.worker.js?url'
        )
        const { default: duckdb_wasm_eh } = await import(
          '@duckdb/duckdb-wasm/dist/duckdb-eh.wasm?url'
        )
        const { default: eh_worker } = await import(
          '@duckdb/duckdb-wasm/dist/duckdb-browser-eh.worker.js?url'
        )
        return { duckdb, duckdb_wasm, mvp_worker, duckdb_wasm_eh, eh_worker }
      })

    const bundle = await this.logger.step('Selecting DuckDB bundle', () => {
      return duckdb.selectBundle({
        mvp: {
          mainModule: duckdb_wasm,
          mainWorker: mvp_worker,
        },
        eh: {
          mainModule: duckdb_wasm_eh,
          mainWorker: eh_worker,
        },
      })
    })

    this.#worker = await this.logger.step('Instantiating Worker', async () => {
      return new Worker(bundle.mainWorker!)
    })

    await this.logger.step('Instantiating DuckDB', async () => {
      const duckDbLogger = new duckdb.ConsoleLogger()
      this.#database = new duckdb.AsyncDuckDB(duckDbLogger, this.#worker)
      await this.#database!.instantiate(bundle.mainModule, bundle.pthreadWorker)
      const version = await this.#database!.getVersion()
      this.logger.log(`Running DuckDB version: ${version}`)
    })

    await this.openDatabase('mydb.db')
  }

  async openDatabase(path: string) {
    if (this.#connection) {
      await this.#connection.close()
    }
    this.#connection = await this.logger.step(
      `Connecting to Database: ${path}`,
      async () => {
        await this.#database!.open({
          path,
          accessMode: DuckDBAccessMode.READ_WRITE,
        })
        return this.#database!.connect()
      },
    )
  }

  #unwrapRawResponse<T>(raw: Table): Array<T> {
    return raw.toArray().map((row) => {
      return row.toJSON()
    })
  }

  query<T extends object = object>(sql: string): Promise<QueryResult<T>> {
    return this.logger.query(sql, async () => {
      if (!this.#connection) {
        throw new DatabaseNotLoadedError()
      }

      const start = performance.now()
      const arrowResult = await this.#connection.query(sql)
      const end = performance.now()
      return {
        rows: this.#unwrapRawResponse<T>(arrowResult),
        affectedRows: 0,
        duration: end - start,
        id: getId('result'),
      } as QueryResult<T>
    })
  }

  async getRegisteredFiles() {
    if (!this.#database) {
      throw new DatabaseNotLoadedError()
    }

    return await this.#database.globFiles('*')
  }

  async registerFile(file: FileAccessor) {
    if (!this.#database) {
      throw new DatabaseNotLoadedError()
    }

    const blob = await file.readBlob()
    const buffer = new Uint8Array(await blob.arrayBuffer())
    return await this.#database.registerFileBuffer(file.getName(), buffer)
  }

  async registerEmptyFile(name: string) {
    if (!this.#database) {
      throw new DatabaseNotLoadedError()
    }

    return await this.#database.registerEmptyFileBuffer(name)
  }

  async registerFileUrl(name: string, url: string) {
    if (!this.#database) {
      throw new DatabaseNotLoadedError()
    }

    return await this.#database.registerFileURL(
      name,
      url,
      DuckDBDataProtocol.HTTP,
      false,
    )
  }

  async renameFile(oldName: string, newName: string) {
    if (!this.#database) {
      throw new DatabaseNotLoadedError()
    }

    await this.#database.copyFileToPath(oldName, newName)
    await this.#database.dropFile(oldName)
  }

  async exportFile(name: string) {
    if (!this.#database) {
      throw new DatabaseNotLoadedError()
    }

    const buffer = await this.#database.copyFileToBuffer(name)
    return FileAccessor.fromUint8Array(buffer, name)
  }

  async dropFile(name: string) {
    if (!this.#database) {
      throw new DatabaseNotLoadedError()
    }

    await this.#database.dropFile(name)
  }

  async dump() {
    throw new Error(`DuckDB does not support dumping`)
    // just to satisfy the interface
    return FileAccessor.Dummy
  }

  async close() {
    if (this.#connection) {
      await this.#connection.close()
    }
    if (this.#database) {
      await this.#database.terminate()
    }
    if (this.#worker) {
      this.#worker.terminate()
    }
  }
}

export function isDuckDb(dataSource: IDataSource): dataSource is DuckDB {
  return dataSource instanceof DuckDB
}
