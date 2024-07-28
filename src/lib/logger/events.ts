export const LoggerEvent = {
  Logged: 'logged',
  Updated: 'updated',
  Cleared: 'cleared',
} as const
export type LoggerEvent = (typeof LoggerEvent)[keyof typeof LoggerEvent]

export type LoggerEventMap = {
  [LoggerEvent.Logged]: [string]
  [LoggerEvent.Updated]: [string]
  [LoggerEvent.Cleared]: []
}
