import type { IRegistry } from '../interface'
import { DatabaseEngine } from '@/lib/engines/enums'
import { DataSourceMode } from '@/lib/dataSources/enums'

export default function findSqliteDatabases(registry: IRegistry) {
  const keys = Object.keys({ ...localStorage })
  if (keys.some(isSqliteKey)) {
    registry.register({
      engine: DatabaseEngine.SQLite,
      mode: DataSourceMode.BrowserPersisted,
      identifier: null,
    })
  }
}

function isSqliteKey(key: string) {
  return key.startsWith('kvvfs-local-')
}
