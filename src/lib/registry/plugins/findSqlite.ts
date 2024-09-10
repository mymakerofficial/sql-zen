import { DatabaseEngine } from '@/lib/engines/enums'
import { DataSourceMode } from '@/lib/dataSources/enums'
import { Registry } from '@/lib/registry/impl/registry'

export const findSqliteDatabases = Registry.definePlugin((registry) => {
  const keys = Object.keys({ ...localStorage })
  if (keys.some(isSqliteKey)) {
    registry.register({
      engine: DatabaseEngine.SQLite,
      mode: DataSourceMode.BrowserPersisted,
      identifier: 'default',
    })
  }
})

function isSqliteKey(key: string) {
  return key.startsWith('kvvfs-local-')
}
