import { DatabaseEngine, DataSourceDriver } from '@/lib/engines/enums'
import { DataSourceMode } from '@/lib/dataSources/enums'
import type { Registry } from '@/lib/registry/impl/registry'
import { getEngineInfo } from '@/lib/engines/helpers'
import { FileAccessor } from '@/lib/files/fileAccessor'

// @deprecated
export default function findSqliteDatabases(registry: Registry) {
  const keys = Object.keys({ ...localStorage })
  if (keys.some(isSqliteKey)) {
    registry.register({
      engine: DatabaseEngine.SQLite,
      driver: DataSourceDriver.SQLiteWASM,
      mode: DataSourceMode.BrowserPersisted,
      displayName: getEngineInfo(DatabaseEngine.SQLite).name,
      connectionString: '',
      fileAccessor: FileAccessor.Dummy,
    })
  }
}

function isSqliteKey(key: string) {
  return key.startsWith('kvvfs-local-')
}
