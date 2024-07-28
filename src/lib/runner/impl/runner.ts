import { EventPublisher } from '@/lib/events/publisher'
import { RunnerEvent, type RunnerEventMap } from '@/lib/runner/events'
import type { IRunner } from '@/lib/runner/interface'
import type { IDataSource } from '@/lib/dataSources/interface'
import type { Statement } from '@/lib/statements/interface'
import type { Query } from '@/lib/queries/interface'
import { isIdleQuery, isSettledQuery } from '@/lib/queries/helpers'
import { getId } from '@/lib/getId'
import { QueryState } from '@/lib/queries/enums'

export class Runner extends EventPublisher<RunnerEventMap> implements IRunner {
  #queries: Array<Query> = []
  #dataSource: IDataSource

  constructor(dataSource: IDataSource) {
    super()
    this.#dataSource = dataSource
  }

  getDataSource(): IDataSource {
    return this.#dataSource
  }

  getKey(): string {
    return this.#dataSource.getKey()
  }

  #updateQuery(queryId: string, update: Partial<Query>): void {
    const query = this.#queries.find((q) => q.id === queryId)
    if (!query) {
      return
    }

    Object.assign(query, update)
  }

  #cancelAllAfter(queryId: string) {
    const index = this.#queries.findIndex((q) => q.id === queryId)
    this.#queries.slice(index + 1).forEach((query) => {
      if (query.state !== QueryState.Idle) {
        throw Error('All queries after a cancelled query should be idle')
      }
      this.#updateQuery(query.id, { state: QueryState.Cancelled })
      this.emit(RunnerEvent.QueryUpdated, query.id)
    })
  }

  #runQuery(queryId: string): void {
    const query = this.#queries.find((q) => q.id === queryId)
    if (!query) {
      return
    }

    this.#updateQuery(query.id, {
      state: QueryState.Executing,
      when: Date.now(),
    })
    this.emit(RunnerEvent.QueryUpdated, query.id)

    this.#dataSource.query(query.statement.sql).then(
      (result) => {
        this.#updateQuery(query.id, {
          state: QueryState.Success,
          result,
        })
        this.emit(RunnerEvent.QueryUpdated, query.id)
        this.#runNextIdle()
      },
      (error) => {
        this.#updateQuery(query.id, {
          state: QueryState.Error,
          errorMessage: error.message,
        })
        this.emit(RunnerEvent.QueryUpdated, query.id)
        this.#cancelAllAfter(query.id)
      },
    )
  }

  #runNextIdle(): void {
    const nextIdle = this.#queries.find(isIdleQuery)
    if (!nextIdle) {
      return
    }

    this.#runQuery(nextIdle.id)
  }

  #createQuery(statement: Statement): Query {
    return {
      id: getId('query'),
      statement,
      state: QueryState.Idle,
    } as Query
  }

  batch(statements: Array<Statement>): void {
    const allSettled = this.#queries.every(isSettledQuery)
    if (!allSettled) {
      throw new Error(
        'Cannot run new statements while there are active queries',
      )
    }
    this.clear()

    const newQueries = statements.map(this.#createQuery)

    this.#queries.push(...newQueries)
    this.#runNextIdle()
  }

  getQueries(): Array<Query> {
    // todo
    return this.#queries
  }

  clear() {
    const allSettled = this.#queries.every(isSettledQuery)
    if (!allSettled) {
      throw new Error('Cannot clear while there are active queries')
    }

    this.#queries = []
  }
}
