import {
  type DatabaseEngine,
  DataSourceDriverCapability,
  type DataSourceDriver,
} from '@/lib/engines/enums'
import type { DataSourceMode } from '@/lib/dataSources/enums'

export type DatabaseEngineInfo = {
  engine: DatabaseEngine
  name: string
  description: string
  icon: string
  defaultDriver: DataSourceDriver
  shortSlug?: string
}

export type DataSourceDriverInfo = {
  driver: DataSourceDriver
  engines: DatabaseEngine[]
  name: string
  description: string
  icon: string
}

export type DataSourceDriverCapabilities = {
  [DataSourceDriverCapability.ExportDump]: boolean
  [DataSourceDriverCapability.ImportDump]: boolean
  [DataSourceDriverCapability.LocalFileSystems]: boolean
  [DataSourceDriverCapability.Embeddings]: boolean
  [DataSourceDriverCapability.RequiresDesktopApp]: boolean
  [DataSourceDriverCapability.WorksInBrowser]: boolean
  [DataSourceDriverCapability.Identifier]: boolean
  [DataSourceDriverCapability.ConnectionString]: boolean
  [DataSourceDriverCapability.Modes]: DataSourceMode[]
  [DataSourceDriverCapability.Experimental]: boolean
}
