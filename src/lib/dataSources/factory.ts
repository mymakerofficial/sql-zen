import { DatabaseEngine } from '@/lib/engines/enums'
import { DuckDB } from '@/lib/dataSources/impl/duckdb'
import { DataSourceDummy } from '@/lib/dataSources/impl/dummy'
import { SQLite } from '@/lib/dataSources/impl/sqlite'
import { PGLiteDataSource } from '@/lib/dataSources/impl/postgres/pglite'
import type { DataSource } from '@/lib/dataSources/impl/base'
import type { DataSourceData } from '@/lib/dataSources/types'
import { DataSourceMode } from '@/lib/dataSources/enums'
import { PostgreSQLProxy } from '@/lib/dataSources/impl/postgres/postgresqlproxy'

const dummy = new DataSourceDummy({
  engine: DatabaseEngine.None,
  mode: DataSourceMode.None,
  identifier: 'default',
})

export class DataSourceFactory {
  static create(info: DataSourceData): DataSource {
    if (info.engine === DatabaseEngine.DuckDB) {
      return new DuckDB(info)
    } else if (info.engine === DatabaseEngine.SQLite) {
      return new SQLite(info)
    } else if (info.engine === DatabaseEngine.PostgreSQL) {
      return new PGLiteDataSource(info)
    } else if (info.engine === DatabaseEngine.PostgreSQLProxy) {
      return new PostgreSQLProxy(info)
    } else {
      return new DataSourceDummy(info)
    }
  }

  static get dummy(): DataSource {
    return dummy
  }
}
