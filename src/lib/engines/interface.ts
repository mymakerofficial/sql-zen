import {
  type DatabaseEngine,
  DataSourceDriverCapability,
  type DataSourceDriver,
} from '@/lib/engines/enums'

export type DatabaseEngineInfo = {
  engine: DatabaseEngine
  name: string
  description: string
  icon: string
  defaultDriver: DataSourceDriver
}

export type DataSourceDriverInfo = {
  driver: DataSourceDriver
  engines: DatabaseEngine[]
  name: string
  description: string
  icon: string
}

export type DataSourceDriverCapabilities = {
  [key in DataSourceDriverCapability]: boolean
}
