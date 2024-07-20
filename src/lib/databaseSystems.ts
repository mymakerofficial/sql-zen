import postgresqlIcon from '@/assets/icons/postgresql.svg'
import sqliteIcon from '@/assets/icons/sqlite.svg'
import duckdbIcon from '@/assets/icons/duckdb.svg'

export type DatabaseSystemInfo = {
  key: DatabaseSystem,
  name: string,
  description: string,
  icon: string,
}

export const DatabaseSystem = {
  PostgreSQL: 'postgresql',
  SQLite: 'sqlite',
  DuckDB: 'duckdb',
} as const
export type DatabaseSystem = typeof DatabaseSystem[keyof typeof DatabaseSystem]

export const databaseSystems = {
  [DatabaseSystem.PostgreSQL]: {
    name: 'PostgeSQL',
    description: 'PostgreSQL is a versatile database offering advanced features like JSON support, full-text search, and powerful analytics capabilities.',
    icon: postgresqlIcon,
  },
  [DatabaseSystem.SQLite]: {
    name: 'SQLite',
    description: 'SQLite is a lightweight, embedded database ideal for small-scale applications, offering simplicity, speed, and zero configuration.',
    icon: sqliteIcon,
  },
  [DatabaseSystem.DuckDB]: {
    name: 'DuckDB',
    description: 'DuckDB is a fast in-process analytical database offering a feature-rich SQL dialect that is compatible with PostgreSQL.',
    icon: duckdbIcon,
  }
} as const satisfies Record<DatabaseSystem, Omit<DatabaseSystemInfo, 'key'>>

export const databaseSystemsList = Object.entries(databaseSystems).map(([key, info]) => ({
  key,
  ...info,
})) as Array<DatabaseSystemInfo>