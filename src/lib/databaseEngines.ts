import postgresqlIcon from '@/assets/icons/postgresql.svg'
import sqliteIcon from '@/assets/icons/sqlite.svg'
import duckdbIcon from '@/assets/icons/duckdb.svg'

export type DatabaseEngineInfo = {
  key: DatabaseEngine
  name: string
  description: string
  icon: string
}

export const DatabaseEngine = {
  PostgreSQL: 'postgresql',
  SQLite: 'sqlite',
  DuckDB: 'duckdb',
} as const
export type DatabaseEngine =
  (typeof DatabaseEngine)[keyof typeof DatabaseEngine]

export const databaseEngines = {
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
} as const satisfies Record<DatabaseEngine, Omit<DatabaseEngineInfo, 'key'>>

export const databaseEnginesList = Object.entries(databaseEngines).map(
  ([key, info]) => ({
    key,
    ...info,
  }),
) as Array<DatabaseEngineInfo>
