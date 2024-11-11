import type { DatabaseEngine, DataSourceDriver } from '@/lib/engines/enums'
import type { DataSourceMode, DataSourceStatus } from '@/lib/dataSources/enums'
import type { FileAccessor } from '@/lib/files/fileAccessor'

export type DataSourceBase = {
  engine: DatabaseEngine
  driver: DataSourceDriver
  mode: DataSourceMode
  // the display name of the data source
  displayName: string
  // used for drivers that only need a unique name
  identifier: string
  connectionString: string
  // depending on the driver and mode, used to import a dump
  fileAccessor: FileAccessor
}

// @deprecated
export type DataSourceData = DataSourceBase & {}

export type DataSourceInfo = DataSourceBase & {
  id: string
  status: DataSourceStatus
}
