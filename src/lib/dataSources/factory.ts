import { DatabaseEngine, DataSourceDriver } from '@/lib/engines/enums'
import { DuckDBWASMDataSource } from '@/lib/dataSources/impl/duckdb/duckdbWasm'
import { DataSourceDummy } from '@/lib/dataSources/impl/dummy'
import { SQLiteWASMDataSource } from '@/lib/dataSources/impl/sqlite/sqliteWasm'
import { PGLiteDataSource } from '@/lib/dataSources/impl/postgres/pglite'
import type { DataSource } from '@/lib/dataSources/impl/base'
import type { DataSourceData } from '@/lib/dataSources/types'
import { DataSourceMode } from '@/lib/dataSources/enums'
import { PostgreSQLDataSource } from '@/lib/dataSources/impl/postgres/postgresql'
import { FileAccessor } from '@/lib/files/fileAccessor'
import { MySqlDataSource } from '@/lib/dataSources/impl/mysql/mysql'
import { SQLiteDataSource } from '@/lib/dataSources/impl/sqlite/sqlite'

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
  static create(info: DataSourceData, id?: string): DataSource {
    switch (info.driver) {
      case DataSourceDriver.PostgreSQL:
        return new PostgreSQLDataSource(info, id)
      case DataSourceDriver.PGLite:
        return new PGLiteDataSource(info, id)
      case DataSourceDriver.MySQL:
        return new MySqlDataSource(info, id)
      case DataSourceDriver.SQLite:
        return new SQLiteDataSource(info, id)
      case DataSourceDriver.SQLiteWASM:
        return new SQLiteWASMDataSource(info, id)
      case DataSourceDriver.DuckDBWASM:
        return new DuckDBWASMDataSource(info, id)
      default:
        return new DataSourceDummy(info)
    }
  }

  static get dummy(): DataSource {
    return dummy
  }
}
