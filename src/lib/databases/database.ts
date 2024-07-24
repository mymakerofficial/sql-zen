import { Logger } from '@/lib/logger/logger'
import type { DatabaseEngine } from '@/lib/databaseEngines'
import type { DataSourceInfo } from '@/lib/databases/dataSourceFactory'
import { generateKey } from '@/lib/registry/registry'
import type { FileAccessor } from '@/lib/files/fileAccessor'

export const DatabaseEngineMode = {
  Memory: 'memory',
  BrowserPersisted: 'browserPersisted',
} as const
export type DatabaseEngineMode =
  (typeof DatabaseEngineMode)[keyof typeof DatabaseEngineMode]

export type QueryResult<T = Object> = Array<T>

export type DatabaseDump = {
  blob: Blob
  filename: string
}

export abstract class DataSourceFacade implements DataSourceInfo {
  protected logger = new Logger()
  abstract readonly engine: DatabaseEngine

  constructor(
    readonly mode: DatabaseEngineMode,
    readonly identifier: string | null,
    readonly fileAccessor: FileAccessor | null = null,
  ) {}

  getLogger() {
    return this.logger
  }

  getKey() {
    return generateKey(this)
  }

  abstract init(): Promise<void>

  abstract query<T = Object>(sql: string): Promise<QueryResult<T>>

  abstract dump(): Promise<DatabaseDump>

  abstract close(): Promise<void>
}
