import { separateQueries } from '@/lib/separateQueries'
import { Logger } from '@/lib/logger/logger'

export type QueryResult = Array<Object>

export abstract class DatabaseFacade {
  protected logger = new Logger()

  getLogger() {
    return this.logger
  }

  abstract init(): Promise<void>

  abstract query(sql: string): Promise<QueryResult>

  async exec(sql: string) {
    const promises = separateQueries(sql).map((stmnt) => this.query(stmnt))
    return await Promise.all(promises)
  }

  abstract close(): Promise<void>
}
