import type { DatabaseEngine } from '@/lib/engines/enums'
import type { DataSourceMode, DataSourceStatus } from '@/lib/dataSources/enums'
import type { FileAccessor } from '@/lib/files/fileAccessor'

export type DataSourceBase = {
  engine: DatabaseEngine
  mode: DataSourceMode
  identifier: string
}

export type DataSourceData = DataSourceBase & {
  dump?: FileAccessor | null
}

export type DataSourceInfo = DataSourceBase & {
  key: string
  displayName: string
  status: DataSourceStatus
}
