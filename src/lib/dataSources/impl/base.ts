import type {
  DataSourceCompleteDescriptor,
  DataSourceDescriptor,
  IDataSource,
} from '@/lib/dataSources/interface'
import type { DatabaseEngine } from '@/lib/engines/enums'
import type { DataSourceMode } from '@/lib/dataSources/enums'
import { FileAccessor } from '@/lib/files/fileAccessor'
import { generateDataSourceKey } from '@/lib/dataSources/helpers'
import type { QueryResult } from '@/lib/queries/interface'
import { type ILogger } from '@/lib/logger/interface'
import type { ISqlDialect } from '@/lib/dialect/interface'
import { SqlDialectFactory } from '@/lib/dialect/factory'
import type { FileInfo } from '@/lib/files/interface'
import { Logger } from '@/lib/logger/impl/logger'

export abstract class DataSource implements IDataSource {
  readonly #engine: DatabaseEngine
  readonly #mode: DataSourceMode
  readonly #identifier: string | null
  readonly #key: string

  protected initDump: FileAccessor | null
  protected logger = new Logger()

  constructor(descriptor: DataSourceCompleteDescriptor) {
    this.#engine = descriptor.engine
    this.#mode = descriptor.mode
    this.#identifier = descriptor.identifier
    this.initDump = descriptor.dump || null
    this.#key = generateDataSourceKey(descriptor)
  }

  getDescriptor(): DataSourceDescriptor {
    return {
      engine: this.#engine,
      mode: this.#mode,
      identifier: this.#identifier,
    }
  }

  getEngine(): DatabaseEngine {
    return this.#engine
  }

  getMode(): DataSourceMode {
    return this.#mode
  }

  getIdentifier(): string | null {
    return this.#identifier
  }

  getKey(): string {
    return this.#key
  }

  getLogger(): ILogger {
    return this.logger
  }

  getDialect(): ISqlDialect {
    return SqlDialectFactory.create(this)
  }

  abstract isInitialized(): boolean

  abstract init(): Promise<void>

  abstract query<T extends object = object>(
    sql: string,
  ): Promise<QueryResult<T>>

  async getFiles(): Promise<Array<FileInfo>> {
    return []
  }

  async readFile(_path: string): Promise<FileAccessor> {
    return FileAccessor.Dummy
  }

  async writeFile(_path: string, _fileAccessor: FileAccessor): Promise<void> {
    return
  }

  async deleteFile(_path: string): Promise<void> {
    return
  }

  abstract dump(): Promise<FileAccessor>

  abstract close(): Promise<void>
}
