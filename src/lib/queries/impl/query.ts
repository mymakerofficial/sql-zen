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
import { Mutex } from 'async-mutex'

export class Query<T extends object = object>
  extends EventPublisher<QueryEventMap>
  implements IQuery<T>
{
  readonly #mutex = new Mutex()
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

  #setResult(
    result: QueryResult<T> | PaginatedQueryResult<T>,
    offset: number,
    limit: number,
  ) {
    if (this.#isPaginated) {
      this.#result = {
        ...result,
        totalRows: this.#probableRowCount,
        offset,
        limit,
      } as PaginatedQueryResult<T>
    } else {
      this.#result = result
    }
    this.#error = null
    this.#setState(QueryState.Success)
    return this.#result
  }

  #setError(err: Error) {
    this.#error = err
    this.#result = null
    this.#setState(QueryState.Error)
    return err
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

  #getSql(offset: number, limit: number) {
    if (this.#isPaginated) {
      return this.#dialect.makePaginatedStatement(
        this.#statement.sql,
        offset,
        limit,
      )
    } else {
      return this.#statement.sql
    }
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
    await this.#mutex.runExclusive(async () => {
      this.#setState(QueryState.Executing)
      await this.#analyze().catch((err) => this.#setError(err))
    })
    await this.fetchRows(0, 100)
    this.emit(QueryEvent.InitialResultCompleted)
  }

  async fetchRows(offset: number, limit: number) {
    await this.#mutex.runExclusive(async () => {
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
      const sql = this.#getSql(offset, limit)
      this.#setState(QueryState.Executing)
      await this.#dataSource.query<T>(sql).then(
        (res) => this.#setResult(res, offset, limit),
        (err) => this.#setError(err),
      )
    })
  }

  cancel() {
    if (this.#state !== QueryState.Idle) {
      throw new Error('Can only cancel idle queries')
    }
    this.#setState(QueryState.Cancelled)
  }
}
