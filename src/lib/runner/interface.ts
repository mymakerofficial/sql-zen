import { EventPublisher } from '@/lib/events/publisher'
import type { RunnerEventMap } from '@/lib/runner/events'
import type { IDataSource } from '@/lib/dataSources/interface'
import type { Statement } from '@/lib/statements/interface'
import type { IQuery, QueryInfo } from '@/lib/queries/interface'

export interface IRunner extends EventPublisher<RunnerEventMap> {
  getDataSource(): IDataSource
  // shorthand for getDataSource().getKey()
  getKey(): string
  batch(statements: Array<Statement>, transacting?: boolean): void
  getQueries(): Array<QueryInfo>
  getQuery(id: string): IQuery
  clear(): void
}
