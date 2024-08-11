export const DataSourceEvent = {
  Initializing: 'initializing',
  Initialized: 'initialized',
  Closing: 'closing',
  Closed: 'closed',
} as const
export type DataSourceEvent =
  (typeof DataSourceEvent)[keyof typeof DataSourceEvent]

export type DataSourceEventMap = {
  [DataSourceEvent.Initializing]: []
  [DataSourceEvent.Initialized]: []
  [DataSourceEvent.Closing]: []
  [DataSourceEvent.Closed]: []
}
