import type { Registry } from '@/lib/registry/registry'
import { DatabaseEngine } from '@/lib/databaseEngines'
import { DatabaseEngineMode } from '@/lib/databases/database'

export default function findPostgresDatabases(registry: Registry) {
  indexedDB.databases().then((databases) => {
    databases
      .filter(isPostgresDatabase)
      .forEach((database) => {
        registry.register({
          engine: DatabaseEngine.PostgreSQL,
          mode: DatabaseEngineMode.BrowserPersisted,
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