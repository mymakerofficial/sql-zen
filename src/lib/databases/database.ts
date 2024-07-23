import { separateQueries } from '@/lib/separateQueries'
import { Logger } from '@/lib/logger/logger'
import type { DatabaseEngine } from '@/lib/databaseEngines'
import type { DatabaseInfo } from '@/lib/databases/databaseFactory'

export const DatabaseEngineMode = {
  Memory: 'memory',
  BrowserPersisted: 'browserPersisted',
} as const
export type DatabaseEngineMode =
  (typeof DatabaseEngineMode)[keyof typeof DatabaseEngineMode]

export type QueryResult = Array<Object>

export abstract class DatabaseFacade implements DatabaseInfo {
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

  async exec(sql: string) {
    const queries = separateQueries(sql)
    const results = []
    for (const query of queries) {
      results.push(await this.query(query))
    }
    return results
  }

  abstract close(): Promise<void>
}
