import { DatabaseEngine } from '@/lib/engines/enums'
import { DataSourceMode } from '@/lib/dataSources/enums'
import { Registry } from '@/lib/registry/impl/registry'

export const findPostgresDatabases = Registry.definePlugin((registry) => {
  if (!('indexedDB' in globalThis)) {
    return
  }
  if (!('databases' in indexedDB)) {
    return
  }
  indexedDB.databases().then((databases) => {
    databases.filter(isPostgresDatabase).forEach((database) => {
      registry.register({
        engine: DatabaseEngine.PostgreSQL,
        mode: DataSourceMode.BrowserPersisted,
        identifier: extractIdentifier(database),
      })
    })
  })
})

function isPostgresDatabase(database: IDBDatabaseInfo) {
  return database.name?.startsWith('/pglite/') ?? false
}

function extractIdentifier(database: IDBDatabaseInfo) {
  return database.name?.split('/')[2] ?? ''
}
