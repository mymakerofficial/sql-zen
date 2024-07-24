import { DuckDBDialect } from '@/lib/dialect/duckdb'
import type { DataSourceFacade } from '@/lib/databases/database'
import { DatabaseEngine } from '@/lib/databaseEngines'
import { DummyDialect } from '@/lib/dialect/dialect'
import { PostgreSQLDialect } from '@/lib/dialect/postgresql'
import { SQLiteDialect } from '@/lib/dialect/sqlite'

export class SqlDialectFactory {
  static create(dataSource: DataSourceFacade) {
    if (dataSource.engine === DatabaseEngine.DuckDB) {
      return new DuckDBDialect(dataSource)
    } else if (dataSource.engine === DatabaseEngine.PostgreSQL) {
      return new PostgreSQLDialect(dataSource)
    } else if (dataSource.engine === DatabaseEngine.SQLite) {
      return new SQLiteDialect(dataSource)
    } else {
      return new DummyDialect(dataSource)
    }
  }
}
