import { DatabaseEngine, DataSourceDriver } from '@/lib/engines/enums'
import { DuckDB } from '@/lib/dataSources/impl/duckdb'
import { DataSourceDummy } from '@/lib/dataSources/impl/dummy'
import { SQLite } from '@/lib/dataSources/impl/sqlite'
import { PGLiteDataSource } from '@/lib/dataSources/impl/postgres/pglite'
import type { DataSource } from '@/lib/dataSources/impl/base'
import type { DataSourceData } from '@/lib/dataSources/types'
import { DataSourceMode } from '@/lib/dataSources/enums'
import { PostgreSQLProxy } from '@/lib/dataSources/impl/postgres/postgresqlproxy'
import { FileAccessor } from '@/lib/files/fileAccessor'

const dummy = new DataSourceDummy({
  engine: DatabaseEngine.None,
  driver: DataSourceDriver.None,
  mode: DataSourceMode.None,
  displayName: 'Dummy',
  identifier: 'dummy',
  connectionString: '',
  fileAccessor: FileAccessor.Dummy,
})

export class DataSourceFactory {
  static create(info: DataSourceData): DataSource {
    switch (info.driver) {
      case DataSourceDriver.PostgreSQL:
        return new PostgreSQLProxy(info)
      case DataSourceDriver.PGLite:
        return new PGLiteDataSource(info)
      case DataSourceDriver.SQLiteWASM:
        return new SQLite(info)
      case DataSourceDriver.DuckDBWASM:
        return new DuckDB(info)
      default:
        return new DataSourceDummy(info)
    }
  }

  static get dummy(): DataSource {
    return dummy
  }
}
