import { DuckDBDialect } from '@/lib/dialect/impl/duckdb'
import { PostgreSQLDialect } from '@/lib/dialect/impl/postgresql'
import { SQLiteDialect } from '@/lib/dialect/impl/sqlite'
import { DatabaseEngine } from '@/lib/engines/enums'
import { DummyDialect } from '@/lib/dialect/impl/dummy'
import { DataSource } from '@/lib/dataSources/impl/base'

export class SqlDialectFactory {
  static create(dataSource: DataSource) {
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
