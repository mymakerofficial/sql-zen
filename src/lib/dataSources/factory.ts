import type {
  DataSourceCompleteDescriptor,
  IDataSource,
} from '@/lib/dataSources/interface'
import { DatabaseEngine } from '@/lib/engines/enums'
import { DuckDB } from '@/lib/dataSources/impl/duckdb'
import { DataSourceDummy } from '@/lib/dataSources/impl/dummy'
import { SQLite } from '@/lib/dataSources/impl/sqlite'
import { PostgreSQL } from '@/lib/dataSources/impl/postgresql'
import type { ILoggerStore } from '@/lib/stores/loggerStore/interface'

export class DataSourceFactory {
  static create(
    descriptor: DataSourceCompleteDescriptor,
    loggerStore: ILoggerStore,
  ): IDataSource {
    if (descriptor.engine === DatabaseEngine.DuckDB) {
      return new DuckDB(descriptor, loggerStore)
    } else if (descriptor.engine === DatabaseEngine.SQLite) {
      return new SQLite(descriptor, loggerStore)
    } else if (descriptor.engine === DatabaseEngine.PostgreSQL) {
      return new PostgreSQL(descriptor, loggerStore)
    } else {
      return new DataSourceDummy(descriptor, loggerStore)
    }
  }
}
