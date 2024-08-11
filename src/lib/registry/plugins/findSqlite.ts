import { DatabaseEngine } from '@/lib/engines/enums'
import { DataSourceMode } from '@/lib/dataSources/enums'
import type { Registry } from '@/lib/registry/impl/registry'

export default function findSqliteDatabases(registry: Registry) {
  const keys = Object.keys({ ...localStorage })
  if (keys.some(isSqliteKey)) {
    registry.register({
      engine: DatabaseEngine.SQLite,
      mode: DataSourceMode.BrowserPersisted,
      identifier: 'default',
    })
  }
}

function isSqliteKey(key: string) {
  return key.startsWith('kvvfs-local-')
}
