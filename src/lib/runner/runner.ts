import type { DatabaseFacade, QueryResult } from '@/lib/databases/database'
import type { FoundStatement, StatementRange } from '@/lib/statements'

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

export class Runner {
  private readonly queries: Array<Query> = []
  protected listeners: Array<() => void> = []

  constructor(protected readonly database: DatabaseFacade) {}

  getDatabase() {
    return this.database
  }

  getQueries() {
    return this.queries
  }

  on(callback: () => void) {
    this.listeners.push(callback)
  }

  off(callback: () => void) {
    this.listeners = this.listeners.filter((listener) => listener !== callback)
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener())
  }

  private runNextQuery() {
    const query = this.queries.find(isIdle)
    if (!query) return

    Object.assign(query, {
      state: QueryState.Running,
    })
    this.notifyListeners()
    this.database.query(query.sql).then(
      (result) => {
        // object.assign to avoid type errors
        Object.assign(query, {
          state: QueryState.Success,
          result,
        })
        this.notifyListeners()
        this.runNextQuery()
      },
      (error) => {
        // object.assign to avoid type errors
        Object.assign(query, {
          state: QueryState.Error,
          error,
        })
        this.cancelAllAfter(query)
      },
    )
  }

  push(statements: Array<FoundStatement>) {
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
    this.notifyListeners()
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
    })
    this.notifyListeners()
  }
}

export function isIdle(query: Query): query is QueryIdle {
  return query.state === QueryState.Idle
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
