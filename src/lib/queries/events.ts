import type { QueryState } from '@/lib/queries/enums'

export const QueryEvent = {
  StateChanged: 'state-changed',
  InitialResultCompleted: 'initial-result-completed',
  TotalRowsChanged: 'total-rows-changed',
} as const
export type QueryEvent = (typeof QueryEvent)[keyof typeof QueryEvent]

export type QueryEventMap = {
  [QueryEvent.StateChanged]: [QueryState]
  [QueryEvent.InitialResultCompleted]: []
  [QueryEvent.TotalRowsChanged]: []
}
