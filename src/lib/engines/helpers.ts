import type { DatabaseEngine } from '@/lib/engines/enums'
import {
  databaseEngineCapabilities,
  databaseEnginesMap,
} from '@/lib/engines/constants'

export function getEngineInfo(engine: DatabaseEngine) {
  return databaseEnginesMap[engine]
}

export function getEngineCapabilities(engine: DatabaseEngine) {
  return databaseEngineCapabilities[engine]
}
