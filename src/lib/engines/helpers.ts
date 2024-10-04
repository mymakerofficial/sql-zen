import type { DatabaseEngine, DataSourceDriver } from '@/lib/engines/enums'
import {
  dataSourceDriverCapabilities,
  databaseEnginesMap,
  dataSourceDrivers,
} from '@/lib/engines/constants'

export function getEngineInfo(engine: DatabaseEngine) {
  return databaseEnginesMap[engine]
}

export function getDriverCapabilities(driver: DataSourceDriver) {
  return dataSourceDriverCapabilities[driver]
}

export function getDataSourceDriversForEngine(engine: DatabaseEngine) {
  return dataSourceDrivers.filter((info) => info.engine === engine)
}
