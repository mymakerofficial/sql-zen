import type { Registry } from '@/lib/registry/registry'
import { DatabaseEngine } from '@/lib/databaseEngines'
import { DatabaseEngineMode } from '@/lib/databases/database'

export default function findSqliteDatabases(registry: Registry) {
  const keys = Object.keys({ ...localStorage });
  if (keys.some(isSqliteKey)) {
    registry.register({
      engine: DatabaseEngine.SQLite,
      mode: DatabaseEngineMode.BrowserPersisted,
      identifier: null,
    })
  }
}

function isSqliteKey(key: string) {
  return key.startsWith('kvvfs-local-')
}