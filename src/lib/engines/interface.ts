import {
  type DatabaseEngine,
  DatabaseEngineCapability,
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
  engine: DatabaseEngine
  name: string
  description: string
  icon: string
}

export type DatabaseEngineCapabilities = {
  [key in DatabaseEngineCapability]: boolean
}
