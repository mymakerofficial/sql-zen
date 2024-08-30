import type { DataTypeDefinition } from '@/lib/schema/columns/types/base'

export const SqliteDataType = {
  Null: 'NULL', // NULL can be an explicit column type in SQLite
  Integer: 'INTEGER',
  Real: 'REAL',
  Text: 'TEXT',
  Blob: 'BLOB',
} as const
export type SqliteDataType =
  (typeof SqliteDataType)[keyof typeof SqliteDataType]

export const SqliteDataTypeDefinition = {
  [SqliteDataType.Null]: {
    name: 'null',
  },
  [SqliteDataType.Integer]: {
    name: 'integer',
  },
  [SqliteDataType.Real]: {
    name: 'real',
  },
  [SqliteDataType.Text]: {
    name: 'text',
  },
  [SqliteDataType.Blob]: {
    name: 'blob',
  },
} as const satisfies Record<SqliteDataType, DataTypeDefinition>

export const SqliteTypeMap = {
  ['null']: SqliteDataType.Null,
  ['integer']: SqliteDataType.Integer,
  ['real']: SqliteDataType.Real,
  ['text']: SqliteDataType.Text,
  ['blob']: SqliteDataType.Blob,
} as const satisfies Record<string, SqliteDataType>
