import { separateQueries } from '@/lib/separateQueries'

export type QueryResult = Array<Object>

export abstract class DatabaseFacade {
  constructor() {}

  abstract init(): Promise<void>

  abstract query(sql: string): Promise<QueryResult>

  async exec(sql: string) {
    const promises = separateQueries(sql).map((stmnt) => this.query(stmnt))
    return await Promise.all(promises)
  }

  abstract close(): Promise<void>
}
