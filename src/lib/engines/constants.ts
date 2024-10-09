import postgresqlIcon from '@/assets/icons/postgresql.svg'
import sqliteIcon from '@/assets/icons/sqlite.svg'
import duckdbIcon from '@/assets/icons/duckdb.svg'
import pgliteIcon from '@/assets/icons/pglite.svg'
import wasmIcon from '@/assets/icons/web-assembly.svg'
import mysqlIcon from '@/assets/icons/mysql.svg'
import mariadbIcon from '@/assets/icons/mariadb.svg'
import {
  DatabaseEngine,
  DataSourceDriver,
  DataSourceDriverCapability,
} from '@/lib/engines/enums'
import type {
  DatabaseEngineInfo,
  DataSourceDriverCapabilities,
  DataSourceDriverInfo,
} from '@/lib/engines/interface'
import { isTauri } from '@tauri-apps/api/core'

export const databaseEnginesMap = {
  [DatabaseEngine.None]: {
    name: 'None',
    description: 'No database engine selected.',
    icon: '',
    defaultDriver: DataSourceDriver.None,
  },
  [DatabaseEngine.PostgreSQL]: {
    name: 'PostgeSQL',
    description:
      'PostgreSQL is a versatile database offering advanced features like JSON support, full-text search, and powerful analytics capabilities.',
    icon: postgresqlIcon,
    defaultDriver: isTauri()
      ? DataSourceDriver.PostgreSQL
      : DataSourceDriver.PGLite,
  },
  [DatabaseEngine.SQLite]: {
    name: 'SQLite',
    description:
      'SQLite is a lightweight, embedded database ideal for small-scale applications, offering simplicity, speed, and zero configuration.',
    icon: sqliteIcon,
    defaultDriver: DataSourceDriver.SQLiteWASM,
  },
  [DatabaseEngine.MySQL]: {
    name: 'MySQL',
    description:
      'MySQL is a popular open-source relational database that is widely used in web development.',
    icon: mysqlIcon,
    defaultDriver: DataSourceDriver.MySQL,
  },
  [DatabaseEngine.MariaDB]: {
    name: 'MariaDB',
    description:
      'MariaDB is a community-developed fork of MySQL, designed to remain free and open-source.',
    icon: mariadbIcon,
    defaultDriver: DataSourceDriver.MySQL,
  },
  [DatabaseEngine.DuckDB]: {
    name: 'DuckDB',
    description:
      'DuckDB is a fast in-process analytical database offering a feature-rich SQL dialect that is compatible with PostgreSQL.',
    icon: duckdbIcon,
    defaultDriver: DataSourceDriver.DuckDBWASM,
  },
} as const satisfies Record<DatabaseEngine, Omit<DatabaseEngineInfo, 'engine'>>

export const dataSourceDriversMap = {
  [DataSourceDriver.None]: {
    engines: [DatabaseEngine.None],
    name: 'None',
    description: 'No driver selected.',
    icon: '',
  },
  [DataSourceDriver.PostgreSQL]: {
    engines: [DatabaseEngine.PostgreSQL],
    name: 'PostgreSQL Connector',
    description:
      'Connect to a local or remote Postgres database using a standard connection string.',
    icon: postgresqlIcon,
  },
  [DataSourceDriver.PGLite]: {
    engines: [DatabaseEngine.PostgreSQL],
    name: 'PGLite',
    description: 'Run a complete Postgres database in your browser.',
    icon: pgliteIcon,
  },
  [DataSourceDriver.MySQL]: {
    engines: [DatabaseEngine.MySQL, DatabaseEngine.MariaDB],
    name: 'MySQL Connector',
    description:
      'Connect to any MySQL or MariaDB database using a standard connection string.',
    icon: mysqlIcon,
  },
  [DataSourceDriver.SQLiteWASM]: {
    engines: [DatabaseEngine.SQLite],
    name: 'sqlite-wasm',
    description: 'Run a SQLite database in your browser.',
    icon: wasmIcon,
  },
  [DataSourceDriver.DuckDBWASM]: {
    engines: [DatabaseEngine.DuckDB],
    name: 'duckdb-wasm',
    description: 'Run a DuckDB database in your browser.',
    icon: wasmIcon,
  },
} as const satisfies Record<
  DataSourceDriver,
  Omit<DataSourceDriverInfo, 'driver'>
>

export const dataSourceDriverCapabilities = {
  [DataSourceDriver.None]: {
    [DataSourceDriverCapability.ExportDump]: false,
    [DataSourceDriverCapability.ImportDump]: false,
    [DataSourceDriverCapability.LocalFileSystems]: false,
    [DataSourceDriverCapability.Embeddings]: false,
    [DataSourceDriverCapability.RequiresDesktopApp]: false,
    [DataSourceDriverCapability.WorksInBrowser]: false,
    [DataSourceDriverCapability.Identifier]: false,
    [DataSourceDriverCapability.ConnectionString]: false,
    [DataSourceDriverCapability.Mode]: false,
    [DataSourceDriverCapability.Experimental]: false,
  },
  [DataSourceDriver.PostgreSQL]: {
    [DataSourceDriverCapability.ExportDump]: false,
    [DataSourceDriverCapability.ImportDump]: false,
    [DataSourceDriverCapability.LocalFileSystems]: false,
    [DataSourceDriverCapability.Embeddings]: false,
    [DataSourceDriverCapability.RequiresDesktopApp]: true,
    [DataSourceDriverCapability.WorksInBrowser]: false,
    [DataSourceDriverCapability.Identifier]: false,
    [DataSourceDriverCapability.ConnectionString]: true,
    [DataSourceDriverCapability.Mode]: false,
    [DataSourceDriverCapability.Experimental]: false,
  },
  [DataSourceDriver.PGLite]: {
    [DataSourceDriverCapability.ExportDump]: true,
    [DataSourceDriverCapability.ImportDump]: true,
    [DataSourceDriverCapability.LocalFileSystems]: true,
    [DataSourceDriverCapability.Embeddings]: true,
    [DataSourceDriverCapability.RequiresDesktopApp]: false,
    [DataSourceDriverCapability.WorksInBrowser]: true,
    [DataSourceDriverCapability.Identifier]: true,
    [DataSourceDriverCapability.ConnectionString]: false,
    [DataSourceDriverCapability.Mode]: true,
    [DataSourceDriverCapability.Experimental]: false,
  },
  [DataSourceDriver.SQLiteWASM]: {
    [DataSourceDriverCapability.ExportDump]: true,
    [DataSourceDriverCapability.ImportDump]: true,
    [DataSourceDriverCapability.LocalFileSystems]: false,
    [DataSourceDriverCapability.Embeddings]: false,
    [DataSourceDriverCapability.RequiresDesktopApp]: false,
    [DataSourceDriverCapability.WorksInBrowser]: true,
    [DataSourceDriverCapability.Identifier]: true,
    [DataSourceDriverCapability.ConnectionString]: false,
    [DataSourceDriverCapability.Mode]: true,
    [DataSourceDriverCapability.Experimental]: false,
  },
  [DataSourceDriver.MySQL]: {
    [DataSourceDriverCapability.ExportDump]: false,
    [DataSourceDriverCapability.ImportDump]: false,
    [DataSourceDriverCapability.LocalFileSystems]: false,
    [DataSourceDriverCapability.Embeddings]: false,
    [DataSourceDriverCapability.RequiresDesktopApp]: true,
    [DataSourceDriverCapability.WorksInBrowser]: false,
    [DataSourceDriverCapability.Identifier]: false,
    [DataSourceDriverCapability.ConnectionString]: true,
    [DataSourceDriverCapability.Mode]: false,
    [DataSourceDriverCapability.Experimental]: true,
  },
  [DataSourceDriver.DuckDBWASM]: {
    [DataSourceDriverCapability.ExportDump]: false,
    [DataSourceDriverCapability.ImportDump]: false,
    [DataSourceDriverCapability.LocalFileSystems]: true,
    [DataSourceDriverCapability.Embeddings]: false,
    [DataSourceDriverCapability.RequiresDesktopApp]: false,
    [DataSourceDriverCapability.WorksInBrowser]: true,
    [DataSourceDriverCapability.Identifier]: false,
    [DataSourceDriverCapability.ConnectionString]: false,
    [DataSourceDriverCapability.Mode]: false,
    [DataSourceDriverCapability.Experimental]: false,
  },
} as const satisfies Record<DataSourceDriver, DataSourceDriverCapabilities>

export const databaseEngines = Object.entries(databaseEnginesMap).map(
  ([engine, info]) => ({
    engine,
    ...info,
  }),
) as Array<DatabaseEngineInfo>

export const dataSourceDrivers = Object.entries(dataSourceDriversMap).map(
  ([driver, info]) => ({
    driver,
    ...info,
  }),
) as Array<DataSourceDriverInfo>

export const selectableDatabaseEngines = databaseEngines.filter(
  ({ engine }) => engine !== DatabaseEngine.None,
)
