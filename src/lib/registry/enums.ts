export const DataSourceStatus = {
  Stopped: 'stopped',
  Pending: 'pending',
  Running: 'running',
} as const
export type DataSourceStatus =
  (typeof DataSourceStatus)[keyof typeof DataSourceStatus]
