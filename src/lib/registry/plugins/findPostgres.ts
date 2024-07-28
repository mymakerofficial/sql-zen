import type { IRegistry } from '../interface'
import { DatabaseEngine } from '@/lib/engines/enums'
import { DataSourceMode } from '@/lib/dataSources/enums'

export default function findPostgresDatabases(registry: IRegistry) {
  indexedDB.databases().then((databases) => {
    databases.filter(isPostgresDatabase).forEach((database) => {
      registry.register({
        engine: DatabaseEngine.PostgreSQL,
        mode: DataSourceMode.BrowserPersisted,
        identifier: extractIdentifier(database),
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
