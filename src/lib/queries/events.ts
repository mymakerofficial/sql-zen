import type { QueryState } from '@/lib/queries/enums'
import type { QueryInfo } from '@/lib/queries/interface'

export const QueryEvent = {
  StateChanged: 'state-changed',
  InitialResultCompleted: 'initial-result-completed',
  TotalRowsChanged: 'total-rows-changed',
} as const
export type QueryEvent = (typeof QueryEvent)[keyof typeof QueryEvent]

export type QueryEventMap = {
  [QueryEvent.StateChanged]: [QueryState]
  [QueryEvent.InitialResultCompleted]: [QueryInfo]
  [QueryEvent.TotalRowsChanged]: []
}
