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
    const queries = separateQueries(sql)
    const results = []
    for (const query of queries) {
      results.push(await this.query(query))
    }
    return results
  }

  abstract close(): Promise<void>
}
