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
