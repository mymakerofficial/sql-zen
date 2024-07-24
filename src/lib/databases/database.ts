import { separateQueries } from '@/lib/separateQueries'
import { Logger } from '@/lib/logger/logger'
import type { DatabaseEngine } from '@/lib/databaseEngines'
import type { DataSourceInfo } from '@/lib/databases/dataSourceFactory'

export const DatabaseEngineMode = {
  Memory: 'memory',
  BrowserPersisted: 'browserPersisted',
} as const
export type DatabaseEngineMode =
  (typeof DatabaseEngineMode)[keyof typeof DatabaseEngineMode]

export type QueryResult = Array<Object>

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
  ) {}

  getLogger() {
    return this.logger
  }

  abstract init(): Promise<void>

  abstract query(sql: string): Promise<QueryResult>

  abstract dump(): Promise<DatabaseDump>

  abstract close(): Promise<void>
}
