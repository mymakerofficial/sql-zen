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

export function isDatabaseEngine(arg: any): arg is DatabaseEngine {
  return Object.values(DatabaseEngine).includes(arg)
}

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

export function isDataSourceDriver(arg: any): arg is DataSourceDriver {
  return Object.values(DataSourceDriver).includes(arg)
}

export const DataSourceDriverCapability = {
  ImportDump: 'importDump',
  ExportDump: 'exportDump',
  LocalFileSystems: 'localFileSystems',
  Embeddings: 'embeddings',
  RequiresDesktopApp: 'requiresDesktopApp',
  WorksInBrowser: 'worksInBrowser',
  // show the 'identifier' option in the connection dialog
  Identifier: 'identifier',
  // show the 'connection string' option in the connection dialog
  ConnectionString: 'usesConnectionString',
  Modes: 'modes',
  Experimental: 'experimental',
} as const
export type DataSourceDriverCapability =
  (typeof DataSourceDriverCapability)[keyof typeof DataSourceDriverCapability]
