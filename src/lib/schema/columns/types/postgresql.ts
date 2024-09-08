import type { DataTypeDefinition } from '@/lib/schema/columns/types/base'

export const PostgresDataType = {
  BigInt: 'BIGINT',
  BigSerial: 'BIGSERIAL',
  Bit: 'BIT',
  BitVarying: 'BIT_VARYING',
  Boolean: 'BOOLEAN',
  Box: 'BOX',
  Bytea: 'BYTEA',
  Character: 'CHARACTER',
  CharacterVarying: 'CHARACTER_VARYING',
  Cidr: 'CIDR',
  Circle: 'CIRCLE',
  Date: 'DATE',
  DoublePrecision: 'DOUBLE_PRECISION',
  Inet: 'INET',
  Integer: 'INTEGER',
  Interval: 'INTERVAL',
  Json: 'JSON',
  Jsonb: 'JSONB',
  Line: 'LINE',
  Lseg: 'LSEG',
  Macaddr: 'MACADDR',
  Macaddr8: 'MACADDR8',
  Money: 'MONEY',
  Numeric: 'NUMERIC',
  Path: 'PATH',
  PgLsn: 'PG_LSN',
  PgSnapshot: 'PG_SNAPSHOT',
  Point: 'POINT',
  Polygon: 'POLYGON',
  Real: 'REAL',
  SmallInt: 'SMALLINT',
  SmallSerial: 'SMALLSERIAL',
  Serial: 'SERIAL',
  Text: 'TEXT',
  Time: 'TIME',
  TimeWithTimezone: 'TIME_WITH_TIMEZONE',
  Timestamp: 'TIMESTAMP',
  TimestampWithTimezone: 'TIMESTAMP_WITH_TIMEZONE',
  TsQuery: 'TSQUERY',
  TsVector: 'TSVECTOR',
  TxidSnapshot: 'TXID_SNAPSHOT',
  Uuid: 'UUID',
  Xml: 'XML',
  Name: 'NAME',
  OID: 'OID',
  TID: 'TID',
  XID: 'XID',
  CID: 'CID',
  Vector: 'VECTOR',
} as const
export type PostgresDataType =
  (typeof PostgresDataType)[keyof typeof PostgresDataType]

export const PostgresDataTypeDefinitions = {
  [PostgresDataType.BigInt]: {
    name: 'bigint',
    aliases: ['int8'],
  },
  [PostgresDataType.BigSerial]: {
    name: 'bigserial',
    aliases: ['serial8'],
  },
  [PostgresDataType.Bit]: {
    name: 'bit',
  },
  [PostgresDataType.BitVarying]: {
    name: 'bit varying',
    aliases: ['varbit'],
    displayName: 'varbit',
  },
  [PostgresDataType.Boolean]: {
    name: 'boolean',
    aliases: ['bool'],
    displayName: 'bool',
  },
  [PostgresDataType.Box]: {
    name: 'box',
  },
  [PostgresDataType.Bytea]: {
    name: 'bytea',
  },
  [PostgresDataType.Character]: {
    name: 'character',
    aliases: ['char'],
    displayName: 'char',
  },
  [PostgresDataType.CharacterVarying]: {
    name: 'character varying',
    aliases: ['varchar'],
    displayName: 'varchar',
  },
  [PostgresDataType.Cidr]: {
    name: 'cidr',
  },
  [PostgresDataType.Circle]: {
    name: 'circle',
  },
  [PostgresDataType.Date]: {
    name: 'date',
  },
  [PostgresDataType.DoublePrecision]: {
    name: 'double precision',
    aliases: ['float8'],
    displayName: 'double',
  },
  [PostgresDataType.Inet]: {
    name: 'inet',
  },
  [PostgresDataType.Integer]: {
    name: 'integer',
    aliases: ['int', 'int4'],
    displayName: 'int',
  },
  [PostgresDataType.Interval]: {
    name: 'interval',
  },
  [PostgresDataType.Json]: {
    name: 'json',
  },
  [PostgresDataType.Jsonb]: {
    name: 'jsonb',
  },
  [PostgresDataType.Line]: {
    name: 'line',
  },
  [PostgresDataType.Lseg]: {
    name: 'lseg',
  },
  [PostgresDataType.Macaddr]: {
    name: 'macaddr',
  },
  [PostgresDataType.Macaddr8]: {
    name: 'macaddr8',
  },
  [PostgresDataType.Money]: {
    name: 'money',
  },
  [PostgresDataType.Numeric]: {
    name: 'numeric',
    aliases: ['decimal'],
  },
  [PostgresDataType.Path]: {
    name: 'path',
  },
  [PostgresDataType.PgLsn]: {
    name: 'pg_lsn',
  },
  [PostgresDataType.PgSnapshot]: {
    name: 'pg_snapshot',
  },
  [PostgresDataType.Point]: {
    name: 'point',
  },
  [PostgresDataType.Polygon]: {
    name: 'polygon',
  },
  [PostgresDataType.Real]: {
    name: 'real',
    aliases: ['float4'],
  },
  [PostgresDataType.SmallInt]: {
    name: 'smallint',
    aliases: ['int2'],
  },
  [PostgresDataType.SmallSerial]: {
    name: 'smallserial',
    aliases: ['serial2'],
  },
  [PostgresDataType.Serial]: {
    name: 'serial',
    aliases: ['serial4'],
  },
  [PostgresDataType.Text]: {
    name: 'text',
  },
  [PostgresDataType.Time]: {
    name: 'time',
    aliases: ['time without timezone'],
  },
  [PostgresDataType.TimeWithTimezone]: {
    name: 'time with timezone',
    aliases: ['timetz'],
    displayName: 'timetz',
  },
  [PostgresDataType.Timestamp]: {
    name: 'timestamp',
    aliases: ['timestamp without timezone'],
  },
  [PostgresDataType.TimestampWithTimezone]: {
    name: 'timestamp with timezone',
    aliases: ['timestamptz'],
    displayName: 'timestamptz',
  },
  [PostgresDataType.TsQuery]: {
    name: 'tsquery',
  },
  [PostgresDataType.TsVector]: {
    name: 'tsvector',
  },
  [PostgresDataType.TxidSnapshot]: {
    name: 'txid_snapshot',
  },
  [PostgresDataType.Uuid]: {
    name: 'uuid',
  },
  [PostgresDataType.Xml]: {
    name: 'xml',
  },
  [PostgresDataType.Name]: {
    name: 'name',
  },
  [PostgresDataType.OID]: {
    name: 'oid',
  },
  [PostgresDataType.TID]: {
    name: 'tid',
  },
  [PostgresDataType.XID]: {
    name: 'xid',
  },
  [PostgresDataType.CID]: {
    name: 'cid',
  },
  [PostgresDataType.Vector]: {
    name: 'vector',
  },
} as const satisfies Record<PostgresDataType, DataTypeDefinition>

export const PostgresUDTNameDataTypeMap = {
  ['int2']: PostgresDataType.SmallInt,
  ['int4']: PostgresDataType.Integer,
  ['int8']: PostgresDataType.BigInt,
  ['bool']: PostgresDataType.Boolean,
  ['float4']: PostgresDataType.Real,
  ['float8']: PostgresDataType.DoublePrecision,
  ['numeric']: PostgresDataType.Numeric,
  ['text']: PostgresDataType.Text,
  ['varchar']: PostgresDataType.CharacterVarying,
  ['char']: PostgresDataType.Character,
  ['bytea']: PostgresDataType.Bytea,
  ['date']: PostgresDataType.Date,
  ['time']: PostgresDataType.Time,
  ['timestamp']: PostgresDataType.Timestamp,
  ['timestamptz']: PostgresDataType.TimestampWithTimezone,
  ['interval']: PostgresDataType.Interval,
  ['json']: PostgresDataType.Json,
  ['jsonb']: PostgresDataType.Jsonb,
  ['uuid']: PostgresDataType.Uuid,
  ['xml']: PostgresDataType.Xml,
  ['point']: PostgresDataType.Point,
  ['line']: PostgresDataType.Line,
  ['lseg']: PostgresDataType.Lseg,
  ['box']: PostgresDataType.Box,
  ['path']: PostgresDataType.Path,
  ['polygon']: PostgresDataType.Polygon,
  ['circle']: PostgresDataType.Circle,
  ['cidr']: PostgresDataType.Cidr,
  ['inet']: PostgresDataType.Inet,
  ['macaddr']: PostgresDataType.Macaddr,
  ['macaddr8']: PostgresDataType.Macaddr8,
  ['bit']: PostgresDataType.Bit,
  ['varbit']: PostgresDataType.BitVarying,
  ['tsvector']: PostgresDataType.TsVector,
  ['tsquery']: PostgresDataType.TsQuery,
  ['regtype']: PostgresDataType.OID,
  ['pg_lsn']: PostgresDataType.PgLsn,
  ['pg_snapshot']: PostgresDataType.PgSnapshot,
  ['txid_snapshot']: PostgresDataType.TxidSnapshot,
  ['name']: PostgresDataType.Name,
  ['oid']: PostgresDataType.OID,
  ['tid']: PostgresDataType.TID,
  ['xid']: PostgresDataType.XID,
  ['cid']: PostgresDataType.CID,
  ['money']: PostgresDataType.Money,
  ['vector']: PostgresDataType.Vector,
} as const
