import { EventPublisher } from '@/lib/events/publisher'
import type { RunnerEventMap } from '@/lib/runner/events'
import type { IDataSource } from '@/lib/dataSources/interface'
import type { Statement } from '@/lib/statements/interface'
import type { IQuery } from '@/lib/queries/interface'

export interface IRunner extends EventPublisher<RunnerEventMap> {
  getDataSource(): IDataSource
  // shorthand for getDataSource().getKey()
  getKey(): string
  batch(statements: Array<Statement>): void
  // @deprecated
  getQueries(): Array<IQuery>
  getQueryIds(): Array<string>
  getQuery(id: string): IQuery
  clear(): void
}
