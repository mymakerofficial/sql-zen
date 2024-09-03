import type { QueryInfo } from '@/lib/queries/interface'
import type { Statement } from '@/lib/statements/interface'

export const RunnerEvent = {
  QueryCreated: 'query-created',
  QueryRemoved: 'query-removed',
  QueryHasCompletedInitialResult: 'query-has-completed-initial-result',
  ClearedAll: 'cleared-all',
  QueriesUpdated: 'queries-updated',
  BatchStarted: 'batch-started',
  BatchCompleted: 'batch-completed',
} as const
export type RunnerEvent = (typeof RunnerEvent)[keyof typeof RunnerEvent]

export type RunnerEventMap = {
  [RunnerEvent.QueryCreated]: [QueryInfo]
  [RunnerEvent.QueryRemoved]: [QueryInfo]
  [RunnerEvent.QueryHasCompletedInitialResult]: [QueryInfo]
  [RunnerEvent.ClearedAll]: []
  [RunnerEvent.QueriesUpdated]: []
  [RunnerEvent.BatchStarted]: [statements: Statement[], transacting: boolean]
  [RunnerEvent.BatchCompleted]: [queries: QueryInfo[], transacting: boolean]
}
