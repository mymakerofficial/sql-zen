export const DatabaseEngine = {
  None: 'none',
  PostgreSQL: 'postgresql',
  SQLite: 'sqlite',
  MySQL: 'mysql',
  MariaDB: 'mariadb',
  DuckDB: 'duckdb',
} as const
export type DatabaseEngine =
  (typeof DatabaseEngine)[keyof typeof DatabaseEngine]

export const DataSourceDriver = {
  None: 'none',
  PGLite: 'pglite',
  PostgreSQL: 'postgresql',
  SQLiteWASM: 'sqlite-wasm',
  SQLite: 'sqlite',
  MySQL: 'mysql',
  DuckDBWASM: 'duckdb-wasm',
} as const
export type DataSourceDriver =
  (typeof DataSourceDriver)[keyof typeof DataSourceDriver]

export const DataSourceDriverCapability = {
  ImportDump: 'import-dump',
  ExportDump: 'export-dump',
  LocalFileSystems: 'local-file-systems',
  Embeddings: 'embeddings',
  RequiresDesktopApp: 'requires-desktop-app',
  WorksInBrowser: 'works-in-browser',
  // show the 'identifier' option in the connection dialog
  Identifier: 'identifier',
  // show the 'connection string' option in the connection dialog
  ConnectionString: 'uses-connection-string',
  // temporary: show the 'mode' option in the connection dialog
  Mode: 'supports-mode',
  Experimental: 'experimental',
} as const
export type DataSourceDriverCapability =
  (typeof DataSourceDriverCapability)[keyof typeof DataSourceDriverCapability]
