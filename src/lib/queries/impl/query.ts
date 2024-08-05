import { getId } from '@/lib/getId'
import type { Statement } from '@/lib/statements/interface'
import type { IDataSource } from '@/lib/dataSources/interface'
import type { ISqlDialect } from '@/lib/dialect/interface'
import type {
  IQuery,
  PaginatedQueryResult,
  QueryResult,
} from '@/lib/queries/interface'
import { QueryState } from '@/lib/queries/enums'
import { EventPublisher } from '@/lib/events/publisher'
import { QueryEvent, type QueryEventMap } from '@/lib/queries/events'
import { isPaginatedQueryResult } from '@/lib/queries/helpers'

export class Query<T extends object = object>
  extends EventPublisher<QueryEventMap>
  implements IQuery<T>
{
  readonly #id: string = getId('query')
  readonly #dataSource: IDataSource
  readonly #statement: Statement
  readonly #dialect: ISqlDialect

  #state: QueryState = QueryState.Idle

  #isAnalyzed: boolean = false
  #isSelect: boolean = false
  #probableRowCount: number = 0
  #isPaginated: boolean = false

  #error: Error | null = null
  #result: QueryResult<T> | PaginatedQueryResult<T> | null = null

  constructor(dataSource: IDataSource, statement: Statement) {
    super()
    this.#dataSource = dataSource
    this.#statement = statement
    this.#dialect = this.#dataSource.getDialect()
  }

  getId() {
    return this.#id
  }

  getState() {
    return this.#state
  }

  getStatement() {
    return this.#statement
  }

  hasResult() {
    return this.#result !== null
  }

  #setState(state: QueryState) {
    this.#state = state
    this.emit(QueryEvent.StateChanged, state)
  }

  async #analyze() {
    const originalSql = this.#statement.sql
    this.#isSelect = this.#dialect.isSelect(originalSql)

    if (!this.#isSelect) {
      this.#isAnalyzed = true
      return
    }

    const countStmt = this.#dialect.makeSelectCountFromStatement(originalSql)
    this.#probableRowCount = await this.#dataSource
      .query<{ count: number }>(countStmt)
      .then((res) => res.rows[0].count)

    this.#isPaginated = this.#probableRowCount > 100
    this.#isAnalyzed = true
  }

  getResult(): QueryResult<T> | PaginatedQueryResult<T> | null {
    return this.#result
  }

  getError() {
    return this.#error
  }

  async execute() {
    if (this.hasResult()) {
      throw new Error('Query has already been executed')
    }
    this.#setState(QueryState.Executing)
    await this.#analyze()
    await this.fetchRows(0, 100)
    this.emit(QueryEvent.InitialResultCompleted)
  }

  async fetchRows(offset: number, limit: number) {
    if (!this.#isAnalyzed) {
      throw new Error('Query has not been analyzed yet')
    }
    if (
      this.#result &&
      isPaginatedQueryResult(this.#result) &&
      this.#result.offset === offset &&
      this.#result.limit === limit
    ) {
      return
    }
    let sql: string
    if (this.#isPaginated) {
      sql = this.#dialect.makePaginatedStatement(
        this.#statement.sql,
        offset,
        limit,
      )
    } else {
      sql = this.#statement.sql
    }
    this.#setState(QueryState.Executing)
    this.#result = await this.#dataSource.query<T>(sql).then(
      (res) => {
        this.#setState(QueryState.Success)
        if (this.#isPaginated) {
          return {
            ...res,
            totalRows: this.#probableRowCount,
            offset,
            limit,
          } as PaginatedQueryResult<T>
        } else {
          return res
        }
      },
      (err) => {
        this.#setState(QueryState.Error)
        throw err
      },
    )
  }

  cancel() {
    if (this.#state !== QueryState.Idle) {
      throw new Error('Can only cancel idle queries')
    }
    this.#setState(QueryState.Cancelled)
  }
}