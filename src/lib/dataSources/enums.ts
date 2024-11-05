export const DataSourceMode = {
  None: 'none',
  AttachFile: 'attachFile',
  Connection: 'connection',
  Memory: 'memory',
  BrowserPersisted: 'browserPersisted',
} as const
export type DataSourceMode =
  (typeof DataSourceMode)[keyof typeof DataSourceMode]

export function isDataSourceMode(arg: any): arg is DataSourceMode {
  return Object.values(DataSourceMode).includes(arg)
}

export const DataSourceStatus = {
  Stopped: 'stopped',
  Pending: 'pending',
  Running: 'running',
} as const
export type DataSourceStatus =
  (typeof DataSourceStatus)[keyof typeof DataSourceStatus]
