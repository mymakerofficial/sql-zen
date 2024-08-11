import { DatabaseEngine } from '@/lib/engines/enums'
import { type DataSourceMode, DataSourceStatus } from '@/lib/dataSources/enums'
import { FileAccessor } from '@/lib/files/fileAccessor'
import {
  generateDataSourceKey,
  getDataSourceDisplayName,
  simplifyIdentifier,
} from '@/lib/dataSources/helpers'
import type { QueryResult } from '@/lib/queries/interface'
import { type ILogger } from '@/lib/logger/interface'
import { SqlDialectFactory } from '@/lib/dialect/factory'
import type { FileInfo } from '@/lib/files/interface'
import { Logger } from '@/lib/logger/impl/logger'
import type { DataSourceData, DataSourceInfo } from '@/lib/dataSources/types'
import { EventPublisher } from '@/lib/events/publisher'
import type { DataSourceEventMap } from '@/lib/dataSources/events'
import { DataSourceEvent } from '@/lib/dataSources/events'
import type { SqlDialect } from '@/lib/dialect/impl/base'

export abstract class DataSource
  extends EventPublisher<DataSourceEventMap>
  implements Readonly<DataSourceInfo>
{
  readonly #mode: DataSourceMode
  readonly #identifier: string
  readonly #key: string

  #status: DataSourceStatus = DataSourceStatus.Stopped

  readonly #initDump: FileAccessor | null

  readonly #dialect: SqlDialect
  readonly #logger: Logger

  constructor(data: DataSourceData) {
    super()
    this.#mode = data.mode
    this.#identifier = simplifyIdentifier(data.identifier)
    this.#initDump = data.dump || null
    this.#key = generateDataSourceKey(this.getInfo())
    this.#dialect = SqlDialectFactory.create(this)
    this.#logger = new Logger()
  }

  abstract getEngine(): DatabaseEngine

  get engine(): DatabaseEngine {
    return this.getEngine()
  }

  getMode(): DataSourceMode {
    return this.#mode
  }

  get mode(): DataSourceMode {
    return this.getMode()
  }

  getIdentifier(): string {
    return this.#identifier
  }

  get identifier(): string {
    return this.getIdentifier()
  }

  getKey(): string {
    return this.#key
  }

  get key(): string {
    return this.getKey()
  }

  getStatus(): DataSourceStatus {
    return this.#status
  }

  get status(): DataSourceStatus {
    return this.getStatus()
  }

  protected setStatus(status: DataSourceStatus): void {
    this.#status = status
  }

  getDisplayName(): string {
    return getDataSourceDisplayName(this)
  }

  get displayName(): string {
    return this.getDisplayName()
  }

  getLogger(): ILogger {
    return this.#logger
  }

  get logger(): ILogger {
    return this.getLogger()
  }

  getDialect(): SqlDialect {
    return this.#dialect
  }

  get dialect(): SqlDialect {
    return this.getDialect()
  }

  getInfo(): DataSourceInfo {
    return {
      key: this.key,
      engine: this.engine,
      mode: this.mode,
      identifier: this.identifier,
      displayName: this.displayName,
      status: this.status,
    }
  }

  protected getInitDump(): FileAccessor | null {
    return this.#initDump
  }

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

  async dump(): Promise<FileAccessor> {
    return FileAccessor.Dummy
  }

  async close(): Promise<void> {
    this.emit(DataSourceEvent.Closing)
    this.setStatus(DataSourceStatus.Stopped)
    this.emit(DataSourceEvent.Closed)
    return
  }
}
