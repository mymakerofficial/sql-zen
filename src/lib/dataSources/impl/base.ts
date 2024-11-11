import { DatabaseEngine, DataSourceDriver } from '@/lib/engines/enums'
import { type DataSourceMode, DataSourceStatus } from '@/lib/dataSources/enums'
import { FileAccessor } from '@/lib/files/fileAccessor'
import type { QueryResult } from '@/lib/queries/interface'
import { SqlDialectFactory } from '@/lib/dialect/factory'
import type { FileInfo } from '@/lib/files/interface'
import { Logger } from '@/lib/logger/impl/logger'
import type { DataSourceData, DataSourceInfo } from '@/lib/dataSources/types'
import { EventPublisher } from '@/lib/events/publisher'
import type { DataSourceEventMap } from '@/lib/dataSources/events'
import { DataSourceEvent } from '@/lib/dataSources/events'
import type { SqlDialect } from '@/lib/dialect/impl/base'
import { Runner } from '@/lib/runner/impl/runner'
import { getId } from '@/lib/getId'

export abstract class DataSource
  extends EventPublisher<DataSourceEventMap>
  implements Readonly<DataSourceInfo>
{
  readonly #id: string
  // some drivers support multiple engines, so store the engine here
  readonly #engine: DatabaseEngine
  readonly #mode: DataSourceMode
  #displayName: string
  readonly #identifier: string
  readonly #connectionString: string
  readonly #fileAccessor: FileAccessor

  #status: DataSourceStatus = DataSourceStatus.Stopped

  readonly #runner: Runner
  readonly #logger: Logger
  readonly #dialect: SqlDialect

  constructor(data: DataSourceData, id?: string) {
    super()
    this.#engine = data.engine
    this.#mode = data.mode
    this.#displayName = data.displayName
    this.#identifier = data.identifier
    this.#connectionString = data.connectionString
    this.#fileAccessor = data.fileAccessor

    this.#id = id ?? getId('ds')

    this.#runner = Runner.for(this)
    this.#logger = new Logger()
    this.#dialect = SqlDialectFactory.create(this)
  }

  get id(): string {
    return this.#id
  }

  get engine(): DatabaseEngine {
    return this.#engine
  }

  abstract get driver(): DataSourceDriver

  get mode(): DataSourceMode {
    return this.#mode
  }

  get displayName(): string {
    return this.#displayName
  }

  get identifier() {
    return this.#identifier
  }

  get connectionString(): string {
    return this.#connectionString
  }

  get fileAccessor(): FileAccessor {
    return this.#fileAccessor
  }

  getStatus(): DataSourceStatus {
    return this.#status
  }

  get status(): DataSourceStatus {
    return this.#status
  }

  protected setStatus(status: DataSourceStatus): void {
    this.#status = status
  }

  getRunner(): Runner {
    return this.#runner
  }

  get runner(): Runner {
    return this.getRunner()
  }

  getLogger(): Logger {
    return this.#logger
  }

  get logger(): Logger {
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
      id: this.id,
      engine: this.engine,
      driver: this.driver,
      mode: this.mode,
      displayName: this.displayName,
      identifier: this.identifier,
      connectionString: this.connectionString,
      fileAccessor: this.fileAccessor,
      status: this.status,
    }
  }

  getAnonymizedAnalyticsData(): object {
    return {
      dataSourceEngine: this.engine,
      dataSourceMode: this.mode,
    }
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
