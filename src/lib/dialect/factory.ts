import { DuckDBDialect } from '@/lib/dialect/impl/duckdb'
import { PostgreSQLDialect } from '@/lib/dialect/impl/postgresql'
import { SQLiteDialect } from '@/lib/dialect/impl/sqlite'
import { DatabaseEngine } from '@/lib/engines/enums'
import type { IDataSource } from '@/lib/dataSources/interface'
import { DummyDialect } from '@/lib/dialect/impl/dummy'

export class SqlDialectFactory {
  static create(dataSource: IDataSource) {
    if (dataSource.getEngine() === DatabaseEngine.DuckDB) {
      return new DuckDBDialect(dataSource)
    } else if (dataSource.getEngine() === DatabaseEngine.PostgreSQL) {
      return new PostgreSQLDialect(dataSource)
    } else if (dataSource.getEngine() === DatabaseEngine.SQLite) {
      return new SQLiteDialect(dataSource)
    } else {
      return new DummyDialect(dataSource)
    }
  }
}
