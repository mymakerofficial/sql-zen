import type * as duckdb from '@duckdb/duckdb-wasm'
import { DuckDBAccessMode } from '@duckdb/duckdb-wasm'
import { DatabaseNotLoadedError } from '@/lib/errors'
import { FileAccessor } from '@/lib/files/fileAccessor'
import type { Table } from 'apache-arrow'
import { DataSourceMode, DataSourceStatus } from '@/lib/dataSources/enums'
import type { QueryResult } from '@/lib/queries/interface'
import { getId } from '@/lib/getId'
import { DataSource } from '@/lib/dataSources/impl/base'
import type { FileInfo } from '@/lib/files/interface'
import { DatabaseEngine, DataSourceDriver } from '@/lib/engines/enums'
import { DataSourceEvent } from '@/lib/dataSources/events'
import type { FieldInfo } from '@/lib/schema/columns/column'
import { FieldDefinition } from '@/lib/schema/columns/column'

export class DuckDBWASMDataSource extends DataSource {
  #worker: Worker | null = null
  #database: duckdb.AsyncDuckDB | null = null
  #connection: duckdb.AsyncDuckDBConnection | null = null

  get engine() {
    return DatabaseEngine.DuckDB
  }

  get driver() {
    return DataSourceDriver.DuckDBWASM
  }

  async init() {
    if (this.#connection) {
      return
    }

    this.setStatus(DataSourceStatus.Pending)
    this.emit(DataSourceEvent.Initializing)

    if (this.mode !== DataSourceMode.Memory) {
      throw new Error(`Unsupported mode for DuckDB: ${this.mode}`)
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

    this.setStatus(DataSourceStatus.Running)
    this.emit(DataSourceEvent.Initialized)
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

      const sysStart = performance.now()
      const fields = arrowResult.schema.fields.map((it) =>
        FieldDefinition.fromArrowField(it).toFieldInfo(),
      )
      const rows = this.#unwrapRawResponse<T>(arrowResult)
      const sysEnd = performance.now()

      return {
        fields,
        rows,
        affectedRows: 0,
        duration: end - start,
        systemDuration: sysEnd - sysStart,
        id: getId('result'),
      } as QueryResult<T>
    })
  }

  // @deprecated
  async #getTypes(
    originalSql: string,
    originalResult: Table,
  ): Promise<FieldInfo[]> {
    if (
      originalResult.toArray().length === 0 ||
      originalSql.substring(0, 6).toUpperCase() !== 'SELECT'
    ) {
      // we can only use DESCRIBE for SELECT queries
      //  fallback to looking at the Arrow schema
      return originalResult.schema.fields.map((field) => {
        return FieldDefinition.fromDuckDBNameAndArrowType(
          field.name,
          field.type.toString(),
        ).toFieldInfo()
      })
    }

    if (!this.#connection) {
      throw new DatabaseNotLoadedError()
    }

    return await this.#connection
      .query(`DESCRIBE ${originalSql}`)
      .then((table) =>
        // DESCRIBE succeeded, map the result to FieldInfo
        this.#unwrapRawResponse<{
          column_name: string
          column_type: string
        }>(table).map((row) => {
          return FieldDefinition.fromDuckDBNameAndType(
            row.column_name,
            row.column_type,
          ).toFieldInfo()
        }),
      )
      .catch(() =>
        // DESCRIBE failed, fallback to looking at the Arrow schema
        originalResult.schema.fields.map((field) => {
          return FieldDefinition.fromDuckDBNameAndArrowType(
            field.name,
            field.type.toString(),
          ).toFieldInfo()
        }),
      )
  }

  async getFiles(): Promise<Array<FileInfo>> {
    if (!this.#database) {
      throw new DatabaseNotLoadedError()
    }

    const files = await this.#database.globFiles('*')
    return files.map((file) => {
      return {
        path: file.fileName,
        size: file.fileSize ?? 0,
      }
    })
  }

  async readFile(path: string) {
    if (!this.#database) {
      throw new DatabaseNotLoadedError()
    }

    const [info] = await this.#database.globFiles(path)

    if (!info) {
      throw new Error(`File not found: ${path}`)
    }

    return FileAccessor.fromLazy(
      async () => {
        if (!this.#database) {
          throw new DatabaseNotLoadedError()
        }

        const buffer = await this.#database.copyFileToBuffer(path)
        return new Blob([buffer])
      },
      {
        name: path.split('/').pop() ?? '',
        size: info.fileSize,
      },
    )
  }

  async writeFile(path: string, fileAccessor: FileAccessor) {
    if (!this.#database) {
      throw new DatabaseNotLoadedError()
    }

    const buffer = await fileAccessor.readUint8Array()
    await this.#database.registerFileBuffer(path, buffer)
  }

  async deleteFile(path: string) {
    if (!this.#database) {
      throw new DatabaseNotLoadedError()
    }

    await this.#database.dropFile(path)
  }

  async close() {
    this.emit(DataSourceEvent.Closing)
    if (this.#connection) {
      await this.#connection.close()
    }
    if (this.#database) {
      await this.#database.terminate()
    }
    if (this.#worker) {
      this.#worker.terminate()
    }
    this.setStatus(DataSourceStatus.Stopped)
    this.emit(DataSourceEvent.Closed)
  }
}
