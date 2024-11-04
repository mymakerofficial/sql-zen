export const DataSourceMode = {
  None: 'none',
  Connection: 'connection',
  Memory: 'memory',
  BrowserPersisted: 'browserPersisted',
} as const
export type DataSourceMode =
  (typeof DataSourceMode)[keyof typeof DataSourceMode]

export const DataSourceStatus = {
  Stopped: 'stopped',
  Pending: 'pending',
  Running: 'running',
} as const
export type DataSourceStatus =
  (typeof DataSourceStatus)[keyof typeof DataSourceStatus]
