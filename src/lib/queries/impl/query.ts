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

  #mightYieldRows: boolean = false
  #canBePaginated: boolean = false

  #minTotalRowCount: number = 0
  #totalRowCountIsKnown: boolean = false

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
    result: QueryResult<T>,
    paginated: boolean,
    offset: number,
    limit: number,
  ) {
    if (
      !this.#totalRowCountIsKnown &&
      offset + result.rows.length >= this.#minTotalRowCount
    ) {
      if (result.rows.length < limit) {
        this.#totalRowCountIsKnown = true
      }
      this.#minTotalRowCount = offset + result.rows.length
      this.emit(QueryEvent.TotalRowsChanged)
    }
    if (paginated) {
      this.#result = {
        ...result,
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

  #getSql(paginated: boolean = true, offset: number = 0, limit: number = 100) {
    if (paginated) {
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

  getTotalRowCount() {
    return { min: this.#minTotalRowCount, isKnown: this.#totalRowCountIsKnown }
  }

  async computeTotalRowCount() {
    await this.#mutex.runExclusive(async () => {
      const countStmt = this.#dialect.makeSelectCountFromStatement(
        this.#statement.sql,
      )
      this.#minTotalRowCount = await this.#dataSource
        .query<{ count: number }>(countStmt)
        .then((res) => res.rows[0].count)
      this.#totalRowCountIsKnown = true
      this.emit(QueryEvent.TotalRowsChanged)
    })
  }

  async #run({
    paginated,
    offset,
    limit,
  }: {
    paginated: boolean
    offset: number
    limit: number
  }) {
    const sql = this.#getSql(paginated, offset, limit)
    this.#setState(QueryState.Executing)
    return this.#dataSource.query<T>(sql).then(
      (result) => this.#setResult(result, paginated, offset, limit),
      (error) => {
        this.#setError(error)
        throw error
      },
    )
  }

  async execute() {
    if (this.hasResult()) {
      throw new Error('Query has already been executed')
    }
    await this.#mutex.runExclusive(async () => {
      this.#mightYieldRows = this.#dialect.mightYieldRows(this.#statement.sql)
      await this.#run({
        paginated: this.#mightYieldRows,
        offset: 0,
        limit: 100,
      })
      if (
        this.#mightYieldRows &&
        this.#result &&
        this.#result.rows.length > 0
      ) {
        this.#canBePaginated = true
      }
      this.emit(QueryEvent.InitialResultCompleted)
    })
  }

  async fetchRows(offset: number, limit: number) {
    if (!this.#canBePaginated) {
      return
    }
    await this.#mutex.runExclusive(async () => {
      if (
        this.#result &&
        isPaginatedQueryResult(this.#result) &&
        this.#result.offset === offset &&
        this.#result.limit === limit
      ) {
        return
      }
      await this.#run({
        paginated: true,
        offset,
        limit,
      })
    })
  }

  cancel() {
    if (this.#state !== QueryState.Idle) {
      throw new Error('Can only cancel idle queries')
    }
    this.#setState(QueryState.Cancelled)
  }
}
