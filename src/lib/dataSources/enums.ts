export const DataSourceMode = {
  Memory: 'memory',
  BrowserPersisted: 'browserPersisted',
} as const
export type DataSourceMode =
  (typeof DataSourceMode)[keyof typeof DataSourceMode]
