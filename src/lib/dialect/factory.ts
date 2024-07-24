import { DuckDBDialect } from '@/lib/dialect/duckdb'
import type { DataSourceFacade } from '@/lib/databases/database'
import { DatabaseEngine } from '@/lib/databaseEngines'
import { DummyDialect } from '@/lib/dialect/dialect'

export class SqlDialectFactory {
  static create(dataSource: DataSourceFacade) {
    if (dataSource.engine === DatabaseEngine.DuckDB) {
      return new DuckDBDialect(dataSource)
    } else {
      return new DummyDialect(dataSource)
    }
  }
}
