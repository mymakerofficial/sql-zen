import type { DatabaseEngine } from '@/lib/engines/enums'

export type DatabaseEngineInfo = {
  engine: DatabaseEngine
  name: string
  description: string
  icon: string
}
