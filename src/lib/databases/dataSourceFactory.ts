import { DatabaseEngine } from '@/lib/databaseEngines'
import { PostgreSQL } from '@/lib/databases/postgresql'
import { SQLite } from '@/lib/databases/sqlite'
import { DuckDB } from '@/lib/databases/duckdb'
import type {
  DatabaseEngineMode,
  DataSourceFacade,
} from '@/lib/databases/database'

export type DataSourceInfo = {
  engine: DatabaseEngine
  mode: DatabaseEngineMode
  identifier: string | null
}

export class DataSourceFactory {
  static createDataSource(info: DataSourceInfo): DataSourceFacade {
    const { engine, mode, identifier } = info
    switch (engine) {
      case DatabaseEngine.PostgreSQL:
        return new PostgreSQL(mode, identifier)
      case DatabaseEngine.SQLite:
        return new SQLite(mode, identifier)
      case DatabaseEngine.DuckDB:
        return new DuckDB(mode, identifier)
      default:
        throw new Error(`Unsupported database engine: ${engine}`)
    }
  }
}
