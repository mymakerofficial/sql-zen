import type { DatabaseEngine } from '@/lib/engines/enums'
import type { DataSourceMode } from '@/lib/dataSources/enums'
import type { FileAccessor } from '@/lib/files/fileAccessor'
import type { QueryResult } from '@/lib/queries/interface'
import type { ILogger } from '@/lib/logger/interface'
import type { ISqlDialect } from '@/lib/dialect/interface'

export type DataSourceDescriptor = {
  engine: DatabaseEngine
  mode: DataSourceMode
  identifier: string | null
}

/***
 * Required to initialize a DataSource
 */
export type DataSourceCompleteDescriptor = DataSourceDescriptor & {
  dump?: FileAccessor | null
}

export interface IDataSource {
  getDescriptor(): DataSourceDescriptor
  getEngine(): DatabaseEngine
  getMode(): DataSourceMode
  getIdentifier(): string | null
  getKey(): string
  getLogger(): ILogger
  getDialect(): ISqlDialect
  isInitialized(): boolean
  init(): Promise<void>
  query<T extends object = object>(sql: string): Promise<QueryResult<T>>
  dump(): Promise<FileAccessor>
  close(): Promise<void>
}
