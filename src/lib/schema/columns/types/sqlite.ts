export const SqliteDataType = {
  Null: 'NULL', // NULL can be an explicit column type in SQLite
  Integer: 'INTEGER',
  Real: 'REAL',
  Text: 'TEXT',
  Blob: 'BLOB',
} as const
export type SqliteDataTypes =
  (typeof SqliteDataType)[keyof typeof SqliteDataType]
