import postgresqlIcon from '@/assets/icons/postgresql.svg'
import sqliteIcon from '@/assets/icons/sqlite.svg'
import duckdbIcon from '@/assets/icons/duckdb.svg'
import pgliteIcon from '@/assets/icons/pglite.svg'
import wasmIcon from '@/assets/icons/web-assembly.svg'
import {
  DatabaseEngine,
  DatabaseEngineCapability,
  DataSourceDriver,
} from '@/lib/engines/enums'
import type {
  DatabaseEngineCapabilities,
  DatabaseEngineInfo,
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
    engine: DatabaseEngine.None,
    name: 'None',
    description: 'No driver selected.',
    icon: '',
  },
  [DataSourceDriver.PGLite]: {
    engine: DatabaseEngine.PostgreSQL,
    name: 'PGLite',
    description:
      'Run a complete Postgres database in your browser. No data leaves your computer.',
    icon: pgliteIcon,
  },
  [DataSourceDriver.PostgreSQL]: {
    engine: DatabaseEngine.PostgreSQL,
    name: 'PostgreSQL',
    description:
      'Connect to a local or remote Postgres database using a standard connection string.',
    icon: postgresqlIcon,
  },
  [DataSourceDriver.SQLiteWASM]: {
    engine: DatabaseEngine.SQLite,
    name: 'sqlite-wasm',
    description:
      'Run a SQLite database in your browser. No data leaves your computer.',
    icon: wasmIcon,
  },
  [DataSourceDriver.DuckDBWASM]: {
    engine: DatabaseEngine.DuckDB,
    name: 'duckdb-wasm',
    description:
      'Run a DuckDB database in your browser. No data leaves your computer.',
    icon: wasmIcon,
  },
} as const satisfies Record<
  DataSourceDriver,
  Omit<DataSourceDriverInfo, 'driver'>
>

export const databaseEngineCapabilities = {
  [DatabaseEngine.None]: {
    [DatabaseEngineCapability.UserSelectable]: false,
    [DatabaseEngineCapability.ExportDump]: false,
    [DatabaseEngineCapability.ImportDump]: false,
    [DatabaseEngineCapability.LocalFileSystems]: false,
    [DatabaseEngineCapability.Embeddings]: false,
  },
  [DatabaseEngine.PostgreSQL]: {
    [DatabaseEngineCapability.UserSelectable]: true,
    [DatabaseEngineCapability.ExportDump]: true,
    [DatabaseEngineCapability.ImportDump]: true,
    [DatabaseEngineCapability.LocalFileSystems]: true,
    [DatabaseEngineCapability.Embeddings]: true,
  },
  [DatabaseEngine.SQLite]: {
    [DatabaseEngineCapability.UserSelectable]: true,
    [DatabaseEngineCapability.ExportDump]: true,
    [DatabaseEngineCapability.ImportDump]: true,
    [DatabaseEngineCapability.LocalFileSystems]: false,
    [DatabaseEngineCapability.Embeddings]: false,
  },
  [DatabaseEngine.DuckDB]: {
    [DatabaseEngineCapability.UserSelectable]: true,
    [DatabaseEngineCapability.ExportDump]: false,
    [DatabaseEngineCapability.ImportDump]: false,
    [DatabaseEngineCapability.LocalFileSystems]: true,
    [DatabaseEngineCapability.Embeddings]: false,
  },
} as const satisfies Record<DatabaseEngine, DatabaseEngineCapabilities>

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
  ({ engine }) =>
    databaseEngineCapabilities[engine][DatabaseEngineCapability.UserSelectable],
)
