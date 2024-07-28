export const LogEventType = {
  Message: 'message',
  Error: 'error',
  Query: 'query',
  Step: 'step',
} as const
export type LogEventType = (typeof LogEventType)[keyof typeof LogEventType]

export const PromiseState = {
  Pending: 'pending',
  Success: 'success',
  Error: 'error',
} as const
export type PromiseState = (typeof PromiseState)[keyof typeof PromiseState]
