export const DatabaseEngine = {
  None: 'none',
  PostgreSQL: 'postgresql',
  SQLite: 'sqlite',
  DuckDB: 'duckdb',
} as const
export type DatabaseEngine =
  (typeof DatabaseEngine)[keyof typeof DatabaseEngine]

export const DataSourceDriver = {
  None: 'none',
  PGLite: 'pglite',
  PostgreSQL: 'postgresql',
  SQLiteWASM: 'sqlite-wasm',
  DuckDBWASM: 'duckdb-wasm',
} as const
export type DataSourceDriver =
  (typeof DataSourceDriver)[keyof typeof DataSourceDriver]

export const DatabaseEngineCapability = {
  UserSelectable: 'user-selectable',
  ImportDump: 'import-dump',
  ExportDump: 'export-dump',
  LocalFileSystems: 'local-file-systems',
  Embeddings: 'embeddings',
} as const
export type DatabaseEngineCapability =
  (typeof DatabaseEngineCapability)[keyof typeof DatabaseEngineCapability]
