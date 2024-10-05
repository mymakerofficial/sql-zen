import { DatabaseEngine, DataSourceDriver } from '@/lib/engines/enums'
import { DataSourceMode } from '@/lib/dataSources/enums'
import type { Registry } from '@/lib/registry/impl/registry'
import { FileAccessor } from '@/lib/files/fileAccessor'

// @deprecated
export default function findPostgresDatabases(registry: Registry) {
  if (!('indexedDB' in globalThis)) {
    return
  }
  if (!('databases' in indexedDB)) {
    return
  }
  indexedDB.databases().then((databases) => {
    databases.filter(isPostgresDatabase).forEach((database) => {
      const identifier = extractIdentifier(database)
      registry.register({
        engine: DatabaseEngine.PostgreSQL,
        driver: DataSourceDriver.PGLite,
        mode: DataSourceMode.BrowserPersisted,
        identifier,
        displayName: identifier,
        connectionString: `idb://${identifier}`,
        fileAccessor: FileAccessor.Dummy,
      })
    })
  })
}

function isPostgresDatabase(database: IDBDatabaseInfo) {
  return database.name?.startsWith('/pglite/') ?? false
}

function extractIdentifier(database: IDBDatabaseInfo) {
  return database.name?.split('/')[2] ?? ''
}
