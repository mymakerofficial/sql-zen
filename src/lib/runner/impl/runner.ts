import { EventPublisher, EventType } from '@/lib/events/publisher'
import { RunnerEvent, type RunnerEventMap } from '@/lib/runner/events'
import type { IRunner } from '@/lib/runner/interface'
import type { IDataSource } from '@/lib/dataSources/interface'
import type { Statement } from '@/lib/statements/interface'
import type { IQuery, QueryInfo } from '@/lib/queries/interface'
import { isIdleQuery, isSettledQuery } from '@/lib/queries/helpers'
import { Query } from '@/lib/queries/impl/query'
import { QueryState } from '@/lib/queries/enums'

export class Runner extends EventPublisher<RunnerEventMap> implements IRunner {
  #queries: Array<IQuery> = []
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

  #runNextIdle(): void {
    const nextIdle = this.#queries.find(isIdleQuery)
    if (!nextIdle) {
      return
    }

    this.#runQuery(nextIdle.getId())
  }

  #cancelAllAfter(queryId: string) {
    const index = this.#queries.findIndex((q) => q.id === queryId)
    this.#queries.slice(index + 1).forEach((query) => {
      query.cancel()
    })
  }

  #runQuery(queryId: string): void {
    const query = this.#queries.find((q) => q.getId() === queryId)
    if (!query) {
      return
    }

    query.execute().then(
      () => {
        this.#runNextIdle()
      },
      () => {
        this.#cancelAllAfter(query.getId())
      },
    )
  }

  #handleQueryEvent() {
    this.emit(RunnerEvent.QueriesUpdated)
  }

  #createQuery(statement: Statement): IQuery {
    const query = new Query(this.#dataSource, statement)
    query.on(EventType.Any, this.#handleQueryEvent.bind(this))
    return query
  }

  batch(statements: Array<Statement>): void {
    const allSettled = this.#queries.every(isSettledQuery)
    if (!allSettled) {
      throw new Error(
        'Cannot run new statements while there are active queries',
      )
    }
    this.clear()

    const newQueries = statements.map((it) => this.#createQuery(it))

    this.#queries.push(...newQueries)
    this.emit(RunnerEvent.QueriesUpdated)
    this.#runNextIdle()
  }

  getQueries(): Array<QueryInfo> {
    return this.#queries.map((it) => it.toInfo())
  }

  getQuery(queryId: string): IQuery {
    const query = this.#queries.find((q) => q.getId() === queryId)
    if (!query) {
      throw new Error(`Query with id ${queryId} not found`)
    }
    return query
  }

  clear() {
    const allSettled = this.#queries.every(isSettledQuery)
    if (!allSettled) {
      throw new Error('Cannot clear while there are active queries')
    }

    this.#queries = []
    this.emit(RunnerEvent.QueriesUpdated)
  }
}
