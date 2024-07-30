export const DatabaseEngine = {
  PostgreSQL: 'postgresql',
  SQLite: 'sqlite',
  DuckDB: 'duckdb',
} as const
export type DatabaseEngine =
  (typeof DatabaseEngine)[keyof typeof DatabaseEngine]