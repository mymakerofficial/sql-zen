import type { DataSourceFacade, QueryResult } from '@/lib/databases/database'
import type { FoundStatement, StatementRange } from '@/lib/statements'
import { EventPublisher } from '@/lib/events/publisher'

export const QueryState = {
  Idle: 'idle',
  Running: 'running',
  Success: 'success',
  Error: 'error',
  Cancelled: 'cancelled',
} as const
export type QueryState = (typeof QueryState)[keyof typeof QueryState]

export type QueryBase = {
  sql: string
  range?: StatementRange
  key: string
}

export type QueryIdle = QueryBase & {
  state: typeof QueryState.Idle
}

export type QueryRunning = QueryBase & {
  state: typeof QueryState.Running
}

export type QuerySuccess = QueryBase & {
  state: typeof QueryState.Success
  result: QueryResult
}

export type QueryError = QueryBase & {
  state: typeof QueryState.Error
  error: Error
}

export type QueryCancelled = QueryBase & {
  state: typeof QueryState.Cancelled
}

export type Query =
  | QueryIdle
  | QueryRunning
  | QuerySuccess
  | QueryError
  | QueryCancelled

export const RunnerEvent = {
  ClearAll: 'clear-all',
  QueryAdded: 'query-added',
  QueryUpdated: 'query-updated',
} as const
export type RunnerEvent = (typeof RunnerEvent)[keyof typeof RunnerEvent]

type RunnerEvents = {
  [RunnerEvent.ClearAll]: []
  [RunnerEvent.QueryAdded]: [QueryIdle]
  [RunnerEvent.QueryUpdated]: [Query]
}

export class Runner extends EventPublisher<RunnerEvents> {
  private readonly queries: Array<Query> = []

  constructor(protected readonly dataSource: DataSourceFacade) {
    super()
  }

  getDataSource() {
    return this.dataSource
  }

  getQueries() {
    return this.queries
  }

  private runNextQuery() {
    const query = this.queries.find(isIdle)
    if (!query) return

    Object.assign(query, {
      state: QueryState.Running,
    })
    this.emit(RunnerEvent.QueryUpdated, query)
    this.dataSource.query(query.sql).then(
      (result) => {
        // object.assign to avoid type errors
        Object.assign(query, {
          state: QueryState.Success,
          result,
        })
        this.emit(RunnerEvent.QueryUpdated, query)
        this.runNextQuery()
      },
      (error) => {
        // object.assign to avoid type errors
        Object.assign(query, {
          state: QueryState.Error,
          error,
        })
        this.emit(RunnerEvent.QueryUpdated, query)
        this.cancelAllAfter(query)
      },
    )
  }

  run(statements: Array<FoundStatement>) {
    // the user has pushed new queries after all previous queries have settled
    //  we probably want to clear the previous queries at this point
    const allSettled = this.queries.every(hasSettled)
    if (allSettled) {
      this.clear()
    }

    for (const statement of statements) {
      const { sql, key, ...range } = statement
      this.queries.push({
        sql,
        range,
        key,
        state: QueryState.Idle,
      })
    }

    this.runNextQuery()
  }

  clear() {
    // remove all settled queries
    this.queries.filter(hasSettled).forEach((query) => {
      const index = this.queries.indexOf(query)
      this.queries.splice(index, 1)
    })
    this.emit(RunnerEvent.ClearAll)
  }

  cancelAllAfter(query: Query) {
    const index = this.queries.indexOf(query)
    this.queries.slice(index + 1).forEach((query) => {
      if (query.state !== QueryState.Idle) {
        throw Error('All queries after a cancelled query should be idle')
      }
      Object.assign(query, {
        state: QueryState.Cancelled,
      })
      this.emit(RunnerEvent.QueryUpdated, query)
    })
  }
}

export function isIdle(query: Query): query is QueryIdle {
  return query.state === QueryState.Idle
}

export function isRunning(query: Query): query is QueryRunning {
  return query.state === QueryState.Running
}

export function isSuccessful(query: Query): query is QuerySuccess {
  return query.state === QueryState.Success
}

export function hasSettled(
  query: Query,
): query is QuerySuccess | QueryError | QueryCancelled {
  return (
    query.state === QueryState.Success ||
    query.state === QueryState.Error ||
    query.state === QueryState.Cancelled
  )
}
