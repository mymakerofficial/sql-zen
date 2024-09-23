import postgresqlIcon from '@/assets/icons/postgresql.svg'
import sqliteIcon from '@/assets/icons/sqlite.svg'
import duckdbIcon from '@/assets/icons/duckdb.svg'
import { DatabaseEngine, DatabaseEngineCapability } from '@/lib/engines/enums'
import type {
  DatabaseEngineCapabilities,
  DatabaseEngineInfo,
} from '@/lib/engines/interface'

export const databaseEnginesMap = {
  [DatabaseEngine.None]: {
    name: 'None',
    description: 'No database engine selected.',
    icon: '',
  },
  [DatabaseEngine.PostgreSQL]: {
    name: 'PostgeSQL',
    description:
      'PostgreSQL is a versatile database offering advanced features like JSON support, full-text search, and powerful analytics capabilities.',
    icon: postgresqlIcon,
  },
  [DatabaseEngine.SQLite]: {
    name: 'SQLite',
    description:
      'SQLite is a lightweight, embedded database ideal for small-scale applications, offering simplicity, speed, and zero configuration.',
    icon: sqliteIcon,
  },
  [DatabaseEngine.DuckDB]: {
    name: 'DuckDB',
    description:
      'DuckDB is a fast in-process analytical database offering a feature-rich SQL dialect that is compatible with PostgreSQL.',
    icon: duckdbIcon,
  },
  [DatabaseEngine.PostgreSQLProxy]: {
    name: 'PostgeSQL (proxy)',
    description: 'Connect to a remote database.',
    icon: postgresqlIcon,
  },
} as const satisfies Record<DatabaseEngine, Omit<DatabaseEngineInfo, 'engine'>>

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
  [DatabaseEngine.PostgreSQLProxy]: {
    [DatabaseEngineCapability.UserSelectable]: true,
    [DatabaseEngineCapability.ExportDump]: false,
    [DatabaseEngineCapability.ImportDump]: false,
    [DatabaseEngineCapability.LocalFileSystems]: false,
    [DatabaseEngineCapability.Embeddings]: false,
  },
} as const satisfies Record<DatabaseEngine, DatabaseEngineCapabilities>

export const databaseEngines = Object.entries(databaseEnginesMap).map(
  ([engine, info]) => ({
    engine,
    ...info,
  }),
) as Array<DatabaseEngineInfo>

export const selectableDatabaseEngines = databaseEngines.filter(
  ({ engine }) =>
    databaseEngineCapabilities[engine][DatabaseEngineCapability.UserSelectable],
)
