import type { DataTypeDefinition } from '@/lib/schema/columns/types/base'

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

export const DuckDBTypeDefinition = {
  [DuckDBDataType.BigInt]: {
    name: 'bigint',
    aliases: ['int8', 'long'],
  },
  [DuckDBDataType.Bit]: {
    name: 'bit',
    aliases: ['bitstring'],
  },
  [DuckDBDataType.Blob]: {
    name: 'blob',
    aliases: ['bytea', 'binary', 'varbinary'],
  },
  [DuckDBDataType.Boolean]: {
    name: 'boolean',
    aliases: ['bool', 'logical'],
  },
  [DuckDBDataType.Date]: {
    name: 'date',
  },
  [DuckDBDataType.Decimal]: {
    name: 'decimal',
    aliases: ['numeric'],
  },
  [DuckDBDataType.Double]: {
    name: 'double',
    aliases: ['float8'],
  },
  [DuckDBDataType.Float]: {
    name: 'float',
    aliases: ['float4', 'real'],
  },
  [DuckDBDataType.HugeInt]: {
    name: 'hugeint',
  },
  [DuckDBDataType.Integer]: {
    name: 'integer',
    aliases: ['int4', 'int', 'signed'],
  },
  [DuckDBDataType.Interval]: {
    name: 'interval',
  },
  [DuckDBDataType.SmallInt]: {
    name: 'smallint',
    aliases: ['int2', 'short'],
  },
  [DuckDBDataType.Time]: {
    name: 'time',
  },
  [DuckDBDataType.TimestampWithTimezone]: {
    name: 'timestamp with timezone',
    aliases: ['timestamptz'],
  },
  [DuckDBDataType.Timestamp]: {
    name: 'timestamp',
    aliases: ['datetime'],
  },
  [DuckDBDataType.TinyInt]: {
    name: 'tinyint',
    aliases: ['int1'],
  },
  [DuckDBDataType.UBigInt]: {
    name: 'ubigint',
  },
  [DuckDBDataType.UHugeInt]: {
    name: 'uhugeint',
  },
  [DuckDBDataType.UInteger]: {
    name: 'uinteger',
  },
  [DuckDBDataType.USmallInt]: {
    name: 'usmallint',
  },
  [DuckDBDataType.UTinyInt]: {
    name: 'utinyint',
  },
  [DuckDBDataType.Uuid]: {
    name: 'uuid',
  },
  [DuckDBDataType.Varchar]: {
    name: 'varchar',
    aliases: ['char', 'bpchar', 'text', 'string'],
  },
} as const satisfies Record<DuckDBDataType, DataTypeDefinition>

export const DuckDBTypeMap = {
  ['BIGINT']: DuckDBDataType.BigInt,
  ['BIT']: DuckDBDataType.Bit,
  ['BLOB']: DuckDBDataType.Blob,
  ['BOOLEAN']: DuckDBDataType.Boolean,
  ['DATE']: DuckDBDataType.Date,
  ['DECIMAL']: DuckDBDataType.Decimal,
  ['DOUBLE']: DuckDBDataType.Double,
  ['FLOAT']: DuckDBDataType.Float,
  ['HUGEINT']: DuckDBDataType.HugeInt,
  ['INTEGER']: DuckDBDataType.Integer,
  ['INTERVAL']: DuckDBDataType.Interval,
  ['SMALLINT']: DuckDBDataType.SmallInt,
  ['TIME']: DuckDBDataType.Time,
  ['TIMESTAMPZ']: DuckDBDataType.TimestampWithTimezone,
  ['TIMESTAMP']: DuckDBDataType.Timestamp,
  ['TINYINT']: DuckDBDataType.TinyInt,
  ['UBIGINT']: DuckDBDataType.UBigInt,
  ['UHUGEINT']: DuckDBDataType.UHugeInt,
  ['UINTEGER']: DuckDBDataType.UInteger,
  ['USMALLINT']: DuckDBDataType.USmallInt,
  ['UTINYINT']: DuckDBDataType.UTinyInt,
  ['UUID']: DuckDBDataType.Uuid,
  ['VARCHAR']: DuckDBDataType.Varchar,
} as const satisfies Record<string, DuckDBDataType>

export const ArrowTypeToDuckDBTypeMap = {
  ['Int8']: DuckDBDataType.BigInt,
  ['Int16']: DuckDBDataType.SmallInt,
  ['Int32']: DuckDBDataType.Integer,
  ['Int64']: DuckDBDataType.HugeInt,
  ['Uint8']: DuckDBDataType.TinyInt,
  ['Uint16']: DuckDBDataType.USmallInt,
  ['Uint32']: DuckDBDataType.UInteger,
  ['Uint64']: DuckDBDataType.UHugeInt,
  ['Float']: DuckDBDataType.Float,
  ['Double']: DuckDBDataType.Double,
  ['Utf8']: DuckDBDataType.Varchar,
  ['Binary']: DuckDBDataType.Blob,
  ['Bool']: DuckDBDataType.Boolean,
  ['Date']: DuckDBDataType.Date,
  ['Time']: DuckDBDataType.Time,
  ['Timestamp']: DuckDBDataType.Timestamp,
  ['TimestampTz']: DuckDBDataType.TimestampWithTimezone,
  ['Interval']: DuckDBDataType.Interval,
} as const satisfies Record<string, DuckDBDataType>
