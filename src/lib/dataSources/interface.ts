import type { DatabaseEngine } from '@/lib/engines/enums'
import type { DataSourceMode } from '@/lib/dataSources/enums'
import type { FileAccessor } from '@/lib/files/fileAccessor'
import type { QueryResult } from '@/lib/queries/interface'
import type { ILogger } from '@/lib/logger/interface'
import type { ISqlDialect } from '@/lib/dialect/interface'
import type { FileInfo } from '@/lib/files/interface'

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
  getFiles(): Promise<Array<FileInfo>>
  readFile(path: string): Promise<FileAccessor>
  writeFile(path: string, fileAccessor: FileAccessor): Promise<void>
  deleteFile(path: string): Promise<void>
  dump(): Promise<FileAccessor>
  close(): Promise<void>
}
