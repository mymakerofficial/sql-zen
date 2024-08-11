import type { QueryInfo } from '@/lib/queries/interface'

export const RunnerEvent = {
  QueryCreated: 'query-created',
  ClearedAll: 'cleared-all',
  QueriesUpdated: 'queries-updated',
} as const
export type RunnerEvent = (typeof RunnerEvent)[keyof typeof RunnerEvent]

export type RunnerEventMap = {
  [RunnerEvent.QueryCreated]: [QueryInfo]
  [RunnerEvent.ClearedAll]: []
  [RunnerEvent.QueriesUpdated]: []
}
