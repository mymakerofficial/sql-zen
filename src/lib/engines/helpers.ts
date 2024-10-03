import type { DatabaseEngine } from '@/lib/engines/enums'
import {
  databaseEngineCapabilities,
  databaseEnginesMap,
  dataSourceDrivers,
} from '@/lib/engines/constants'

export function getEngineInfo(engine: DatabaseEngine) {
  return databaseEnginesMap[engine]
}

export function getEngineCapabilities(engine: DatabaseEngine) {
  return databaseEngineCapabilities[engine]
}

export function getDataSourceDriversForEngine(engine: DatabaseEngine) {
  return dataSourceDrivers.filter((info) => info.engine === engine)
}
