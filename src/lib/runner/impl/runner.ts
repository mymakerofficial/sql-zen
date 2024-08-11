import { EventPublisher, EventType } from '@/lib/events/publisher'
import { RunnerEvent, type RunnerEventMap } from '@/lib/runner/events'
import type { Statement } from '@/lib/statements/interface'
import type { QueryInfo } from '@/lib/queries/interface'
import { isIdleQuery, isSettledQuery } from '@/lib/queries/helpers'
import { Query } from '@/lib/queries/impl/query'
import type { DataSource } from '@/lib/dataSources/impl/base'

export class Runner extends EventPublisher<RunnerEventMap> {
  #queries: Array<Query> = []
  #dataSource: DataSource

  constructor(dataSource: DataSource) {
    super()
    this.#dataSource = dataSource
  }

  static for(dataSource: DataSource): Runner {
    return new Runner(dataSource)
  }

  getDataSource(): DataSource {
    return this.#dataSource
  }

  get dataSource(): DataSource {
    return this.getDataSource()
  }

  getKey(): string {
    return this.#dataSource.getKey()
  }

  get key(): string {
    return this.getKey()
  }

  async #runNextIdle() {
    const nextIdle = this.#queries.find(isIdleQuery)
    if (!nextIdle) {
      return
    }

    await this.#runQuery(nextIdle.getId())
  }

  #cancelAllAfter(queryId: string) {
    const index = this.#queries.findIndex((q) => q.id === queryId)
    this.#queries.slice(index + 1).forEach((query) => {
      query.cancel()
    })
  }

  async #runQuery(queryId: string) {
    const query = this.#queries.find((q) => q.getId() === queryId)
    if (!query) {
      return
    }

    await query.execute().then(
      async () => {
        await this.#runNextIdle()
      },
      (error) => {
        this.#cancelAllAfter(query.getId())
        throw error
      },
    )
  }

  async #runAllIdle(transacting = false) {
    const dialect = this.#dataSource.getDialect()
    if (transacting) await dialect.beginTransaction()
    await this.#runNextIdle().then(
      async () => {
        if (transacting) await dialect.commitTransaction()
      },
      async (error) => {
        if (transacting) await dialect.rollbackTransaction()
        throw error
      },
    )
  }

  #handleQueryEvent() {
    this.emit(RunnerEvent.QueriesUpdated)
  }

  #createQuery(statement: Statement): Query {
    const query = new Query(this.#dataSource, statement)
    query.on(EventType.Any, this.#handleQueryEvent.bind(this))
    return query
  }

  batch(statements: Array<Statement>, transacting: boolean = false): void {
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
    this.#runAllIdle(transacting && statements.length > 1).then()
  }

  getQueries(): Array<QueryInfo> {
    return this.#queries.map((it) => it.getInfo())
  }

  getQuery(queryId: string): Query {
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
