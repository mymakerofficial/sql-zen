export const DuckDBDataType = {
  BigInt: 'BIGINT',
  Bit: 'BIT',
  Blob: 'BLOB',
  Boolean: 'BOOLEAN',
  Date: 'DATE',
  Decimal: 'DECIMAL',
  Double: 'DOUBLE',
  Float: 'FLOAT',
  HugeInt: 'HUGEINT',
  Integer: 'INTEGER',
  Interval: 'INTERVAL',
  SmallInt: 'SMALLINT',
  Time: 'TIME',
  TimestampWithTimezone: 'TIMESTAMP_WITH_TIMEZONE',
  Timestamp: 'TIMESTAMP',
  TinyInt: 'TINYINT',
  UBigInt: 'UBIGINT',
  UHugeInt: 'UHUGEINT',
  UInteger: 'UINTEGER',
  USmallInt: 'USMALLINT',
  UTinyInt: 'UTINYINT',
  Uuid: 'UUID',
  Varchar: 'VARCHAR',
} as const
export type DuckDBDataType =
  (typeof DuckDBDataType)[keyof typeof DuckDBDataType]
