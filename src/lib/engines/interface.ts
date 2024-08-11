import {
  type DatabaseEngine,
  DatabaseEngineCapability,
} from '@/lib/engines/enums'

export type DatabaseEngineInfo = {
  engine: DatabaseEngine
  name: string
  description: string
  icon: string
}

export type DatabaseEngineCapabilities = {
  [key in DatabaseEngineCapability]: boolean
}
