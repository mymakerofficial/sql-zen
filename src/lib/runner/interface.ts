import { EventPublisher } from '@/lib/events/publisher'
import type { RunnerEventMap } from '@/lib/runner/events'
import type { IDataSource } from '@/lib/dataSources/interface'
import type { Statement } from '@/lib/statements/interface'
import type { Query } from '@/lib/queries/interface'

export interface IRunner extends EventPublisher<RunnerEventMap> {
  getDataSource(): IDataSource
  // shorthand for getDataSource().getKey()
  getKey(): string
  batch(statements: Array<Statement>): void
  // returns a list of active query keys
  getQueries(): Array<Query>
}
