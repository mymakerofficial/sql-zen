import { DatabaseEngine } from '@/lib/engines/enums'
import { SqliteDataType } from '@/lib/schema/columns/types/sqlite'
import { PostgresDataType } from '@/lib/schema/columns/types/postgresql'
import { DuckDBDataType } from '@/lib/schema/columns/types/duckdb'

export const PseudoDataType = {
  Unknown: 'UNKNOWN',
  Null: 'NULL',
} as const
export type PseudoDataType =
  (typeof PseudoDataType)[keyof typeof PseudoDataType]

export const BasicDataType = {
  Text: 'TEXT',
  Integer: 'INTEGER',
  Real: 'REAL',
  Blob: 'BLOB',
  Boolean: 'BOOLEAN',
  Date: 'DATE',
  Time: 'TIME',
  DateTime: 'DATETIME',
  Numeric: 'NUMERIC',
  Json: 'JSON',
  Vector: 'VECTOR',
} as const
export type BasicDataType = (typeof BasicDataType)[keyof typeof BasicDataType]

export const DataType = {
  ...BasicDataType,
  ...SqliteDataType,
  ...PostgresDataType,
  ...DuckDBDataType,
} as const
export type DataType = (typeof DataType)[keyof typeof DataType]

export const DatabaseEngineDataTypesMap = {
  [DatabaseEngine.None]: BasicDataType,
  [DatabaseEngine.SQLite]: SqliteDataType,
  [DatabaseEngine.PostgreSQL]: PostgresDataType,
  [DatabaseEngine.DuckDB]: DuckDBDataType,
} as const satisfies Record<DatabaseEngine, Record<string, Partial<DataType>>>
export type DatabaseEngineDataTypesMap = typeof DatabaseEngineDataTypesMap

export type DataTypeFromEngine<T extends DatabaseEngine = DatabaseEngine> =
  (typeof DatabaseEngineDataTypesMap)[T][keyof (typeof DatabaseEngineDataTypesMap)[T]]

export type WithPseudoTypes<T> = PseudoDataType | T
