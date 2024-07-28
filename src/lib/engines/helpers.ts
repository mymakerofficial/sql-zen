import type { DatabaseEngine } from '@/lib/engines/enums'
import { databaseEnginesMap } from '@/lib/engines/constants'

export function getEngineInfo(engine: DatabaseEngine) {
  return databaseEnginesMap[engine]
}
