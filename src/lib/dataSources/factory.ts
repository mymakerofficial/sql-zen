import type {
  DataSourceCompleteDescriptor,
  IDataSource,
} from '@/lib/dataSources/interface'
import { DatabaseEngine } from '@/lib/engines/enums'
import { DuckDB } from '@/lib/dataSources/impl/duckdb'
import { DataSourceDummy } from '@/lib/dataSources/impl/dummy'
import { SQLite } from '@/lib/dataSources/impl/sqlite'
import { PostgreSQL } from '@/lib/dataSources/impl/postgresql'

export class DataSourceFactory {
  static create(descriptor: DataSourceCompleteDescriptor): IDataSource {
    if (descriptor.engine === DatabaseEngine.DuckDB) {
      return new DuckDB(descriptor)
    } else if (descriptor.engine === DatabaseEngine.SQLite) {
      return new SQLite(descriptor)
    } else if (descriptor.engine === DatabaseEngine.PostgreSQL) {
      return new PostgreSQL(descriptor)
    } else {
      return new DataSourceDummy(descriptor)
    }
  }
}
