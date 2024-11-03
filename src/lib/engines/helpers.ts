import type { DatabaseEngine, DataSourceDriver } from '@/lib/engines/enums'
import {
  dataSourceDriverCapabilities,
  databaseEnginesMap,
  dataSourceDrivers,
} from '@/lib/engines/constants'
import type { DatabaseEngineInfo } from '@/lib/engines/interface'

export function getEngineInfo(engine: DatabaseEngine) {
  return databaseEnginesMap[engine] as DatabaseEngineInfo
}

export function getDriverCapabilities(driver: DataSourceDriver) {
  return dataSourceDriverCapabilities[driver]
}

export function getDataSourceDriversForEngine(engine: DatabaseEngine) {
  return dataSourceDrivers.filter((info) => info.engines.includes(engine))
}
