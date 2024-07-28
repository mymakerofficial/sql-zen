export const QueryState = {
  // The query is waiting to be executed
  Idle: 'idle',
  // The query is currently being executed
  Executing: 'executing',
  // The query has successfully executed
  Success: 'success',
  // The query has produced an error
  Error: 'error',
  // The query was cancelled because a previous query failed
  Cancelled: 'cancelled',
} as const
export type QueryState = (typeof QueryState)[keyof typeof QueryState]
