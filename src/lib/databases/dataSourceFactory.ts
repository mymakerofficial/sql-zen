import { DatabaseEngine } from '@/lib/databaseEngines'
import { PostgreSQL } from '@/lib/databases/postgresql'
import { SQLite } from '@/lib/databases/sqlite'
import { DuckDB } from '@/lib/databases/duckdb'
import type {
  DatabaseEngineMode,
  DataSourceFacade,
} from '@/lib/databases/database'
import { FileAccessor } from '@/lib/files/fileAccessor'

export type DataSourceInfo = {
  engine: DatabaseEngine
  mode: DatabaseEngineMode
  identifier: string | null
  fileAccessor: FileAccessor | null
}

export class DataSourceFactory {
  static createDataSource(info: DataSourceInfo): DataSourceFacade {
    const { engine, mode, identifier, fileAccessor } = info
    switch (engine) {
      case DatabaseEngine.PostgreSQL:
        return new PostgreSQL(mode, identifier, fileAccessor)
      case DatabaseEngine.SQLite:
        return new SQLite(mode, identifier, fileAccessor)
      case DatabaseEngine.DuckDB:
        return new DuckDB(mode, identifier, fileAccessor)
      default:
        throw new Error(`Unsupported database engine: ${engine}`)
    }
  }
}
