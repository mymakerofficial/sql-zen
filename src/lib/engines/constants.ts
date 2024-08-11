import postgresqlIcon from '@/assets/icons/postgresql.svg'
import sqliteIcon from '@/assets/icons/sqlite.svg'
import duckdbIcon from '@/assets/icons/duckdb.svg'
import { DatabaseEngine } from '@/lib/engines/enums'
import type { DatabaseEngineInfo } from '@/lib/engines/interface'

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
} as const satisfies Record<DatabaseEngine, Omit<DatabaseEngineInfo, 'engine'>>

export const databaseEngines = Object.entries(databaseEnginesMap).map(
  ([engine, info]) => ({
    engine,
    ...info,
  }),
) as Array<DatabaseEngineInfo>
