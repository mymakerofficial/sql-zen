import { DatabaseEngine } from '@/lib/engines/enums'
import {
  SqliteDataType,
  SqliteDataTypeDefinition,
} from '@/lib/schema/columns/types/sqlite'
import {
  PostgresDataType,
  PostgresDataTypeDefinitions,
} from '@/lib/schema/columns/types/postgresql'
import {
  DuckDBDataType,
  DuckDBTypeDefinition,
} from '@/lib/schema/columns/types/duckdb'
import { TypeDefinition } from '@/lib/schema/columns/column'

export type DataTypeDefinition = {
  name: string
  aliases?: string[]
  displayName?: string | ((def: TypeDefinition) => string)
}

export const PseudoDataType = {
  Unknown: 'UNKNOWN',
  Null: 'NULL',
} as const
export type PseudoDataType =
  (typeof PseudoDataType)[keyof typeof PseudoDataType]

export const PseudoDataTypeDefinition = {
  [PseudoDataType.Unknown]: {
    name: 'unknown',
  },
  [PseudoDataType.Null]: {
    name: 'null',
  },
} as const satisfies Record<PseudoDataType, DataTypeDefinition>

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

export const BasicDataTypeDefinition = {
  [BasicDataType.Text]: {
    name: 'text',
  },
  [BasicDataType.Integer]: {
    name: 'integer',
  },
  [BasicDataType.Real]: {
    name: 'real',
  },
  [BasicDataType.Blob]: {
    name: 'blob',
  },
  [BasicDataType.Boolean]: {
    name: 'boolean',
  },
  [BasicDataType.Date]: {
    name: 'date',
  },
  [BasicDataType.Time]: {
    name: 'time',
  },
  [BasicDataType.DateTime]: {
    name: 'datetime',
  },
  [BasicDataType.Numeric]: {
    name: 'numeric',
  },
  [BasicDataType.Json]: {
    name: 'json',
  },
  [BasicDataType.Vector]: {
    name: 'vector',
  },
} as const satisfies Record<BasicDataType, DataTypeDefinition>

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

export const DatabaseEngineDataTypeDefinitionMap = {
  [DatabaseEngine.None]: BasicDataTypeDefinition,
  [DatabaseEngine.SQLite]: SqliteDataTypeDefinition,
  [DatabaseEngine.PostgreSQL]: PostgresDataTypeDefinitions,
  [DatabaseEngine.DuckDB]: DuckDBTypeDefinition,
} as const satisfies Record<DatabaseEngine, Record<string, DataTypeDefinition>>

export type WithPseudoTypes<T> = PseudoDataType | T
