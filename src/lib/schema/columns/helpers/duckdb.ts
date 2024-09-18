import * as arrow from 'apache-arrow'
import { TypeDefinition } from '@/lib/schema/columns/column'
import { DuckDBDataType } from '@/lib/schema/columns/types/duckdb'
import { PseudoDataType } from '@/lib/schema/columns/types/base'

// gets the equivalent DuckDB type definition for an arrow type.
//  based on https://github.com/duckdb/duckdb-wasm/blob/de39e10e74f64aad94955353c84bdd225c66ef60/packages/duckdb-wasm/src/json_typedef.ts#L24
export function arrowTypeToTypeDefinition(
  type: arrow.DataType,
): TypeDefinition {
  switch (type.typeId) {
    case arrow.Type.Binary:
      return TypeDefinition.createDuckDBType({
        dataType: DuckDBDataType.Blob,
      })
    case arrow.Type.Bool:
      return TypeDefinition.createDuckDBType({
        dataType: DuckDBDataType.Boolean,
      })
    case arrow.Type.Date:
      return TypeDefinition.createDuckDBType({
        dataType: DuckDBDataType.Date,
      })
    case arrow.Type.DateDay:
      return TypeDefinition.createDuckDBType({
        dataType: PseudoDataType.Unknown,
        typeName: 'date32[d]',
      })
    case arrow.Type.DateMillisecond:
      return TypeDefinition.createDuckDBType({
        dataType: PseudoDataType.Unknown,
        typeName: 'date64[ms]',
      })
    case arrow.Type.Decimal: {
      const dec = type as arrow.Decimal
      return TypeDefinition.createDuckDBType({
        dataType: DuckDBDataType.Decimal,
        precision: dec.precision,
        scale: dec.scale,
      })
    }
    case arrow.Type.Float:
      return TypeDefinition.createDuckDBType({
        dataType: DuckDBDataType.Float,
      })
    case arrow.Type.Float16:
      return TypeDefinition.createDuckDBType({
        dataType: PseudoDataType.Unknown,
        typeName: 'float16',
      })
    case arrow.Type.Float32:
      return TypeDefinition.createDuckDBType({
        dataType: PseudoDataType.Unknown,
        typeName: 'float32',
      })
    case arrow.Type.Float64:
      return TypeDefinition.createDuckDBType({
        dataType: PseudoDataType.Unknown,
        typeName: 'float64',
      })
    case arrow.Type.Int:
      return TypeDefinition.createDuckDBType({
        dataType: DuckDBDataType.Integer,
        typeName: 'int32',
      })
    case arrow.Type.Int16:
      return TypeDefinition.createDuckDBType({
        dataType: PseudoDataType.Unknown,
        typeName: 'int16',
      })
    case arrow.Type.Int32:
      return TypeDefinition.createDuckDBType({
        dataType: PseudoDataType.Unknown,
        typeName: 'int32',
      })
    case arrow.Type.Int64:
      return TypeDefinition.createDuckDBType({
        dataType: PseudoDataType.Unknown,
        typeName: 'int64',
      })
    case arrow.Type.Uint16:
      return TypeDefinition.createDuckDBType({
        dataType: PseudoDataType.Unknown,
        typeName: 'uint16',
      })
    case arrow.Type.Uint32:
      return TypeDefinition.createDuckDBType({
        dataType: PseudoDataType.Unknown,
        typeName: 'uint32',
      })
    case arrow.Type.Uint64:
      return TypeDefinition.createDuckDBType({
        dataType: PseudoDataType.Unknown,
        typeName: 'uint64',
      })
    case arrow.Type.Uint8:
      return TypeDefinition.createDuckDBType({
        dataType: PseudoDataType.Unknown,
        typeName: 'uint8',
      })
    case arrow.Type.IntervalDayTime:
      return TypeDefinition.createDuckDBType({
        dataType: PseudoDataType.Unknown,
        typeName: 'interval[dt]',
      })
    case arrow.Type.IntervalYearMonth:
      return TypeDefinition.createDuckDBType({
        dataType: PseudoDataType.Unknown,
        typeName: 'interval[m]',
      })
    case arrow.Type.List: {
      const list = type as arrow.List
      return TypeDefinition.createDuckDBType({
        dataType: DuckDBDataType.List,
        valueType: arrowTypeToTypeDefinition(list.valueType),
      })
    }
    case arrow.Type.FixedSizeBinary: {
      const bin = type as arrow.FixedSizeBinary
      return TypeDefinition.createDuckDBType({
        dataType: PseudoDataType.Unknown,
        typeName: `fixedsizebinary[${bin.byteWidth}]`,
        // byteWidth: bin.byteWidth
      })
    }
    case arrow.Type.Null:
      return TypeDefinition.createDuckDBType({
        dataType: PseudoDataType.Null,
      })
    case arrow.Type.Utf8:
      return TypeDefinition.createDuckDBType({
        dataType: DuckDBDataType.Varchar,
      })
    case arrow.Type.Struct: {
      // const struct = type as arrow.Struct
      return TypeDefinition.createDuckDBType({
        dataType: DuckDBDataType.Struct,
        // fields: struct.children.map((c) => arrowToSQLField(c.name, c.type)),
      })
    }
    case arrow.Type.Map: {
      const map = type as arrow.Map_
      return TypeDefinition.createDuckDBType({
        dataType: DuckDBDataType.Map,
        keyType: arrowTypeToTypeDefinition(map.keyType),
        valueType: arrowTypeToTypeDefinition(map.valueType),
      })
    }
    case arrow.Type.Dictionary: {
      const dict = type as arrow.Dictionary
      return TypeDefinition.createDuckDBType({
        dataType: DuckDBDataType.Enum,
        keyType: arrowTypeToTypeDefinition(dict.indices),
        valueType: arrowTypeToTypeDefinition(dict.dictionary),
      })
    }
    case arrow.Type.Time:
      return TypeDefinition.createDuckDBType({
        dataType: DuckDBDataType.Time,
        typeName: 'time[s]',
      })
    case arrow.Type.TimeMicrosecond:
      return TypeDefinition.createDuckDBType({
        dataType: PseudoDataType.Unknown,
        typeName: 'time[us]',
      })
    case arrow.Type.TimeMillisecond:
      return TypeDefinition.createDuckDBType({
        dataType: PseudoDataType.Unknown,
        typeName: 'time[ms]',
      })
    case arrow.Type.TimeNanosecond:
      return TypeDefinition.createDuckDBType({
        dataType: PseudoDataType.Unknown,
        typeName: 'time[ns]',
      })
    case arrow.Type.TimeSecond:
      return TypeDefinition.createDuckDBType({
        dataType: PseudoDataType.Unknown,
        typeName: 'time[s]',
      })
    case arrow.Type.Timestamp: {
      const ts = type as arrow.Timestamp
      if (ts.timezone) {
        return TypeDefinition.createDuckDBType({
          dataType: DuckDBDataType.TimestampWithTimezone,
          // timezone: ts.timezone
        })
      } else {
        return TypeDefinition.createDuckDBType({
          dataType: DuckDBDataType.Timestamp,
        })
      }
    }
    case arrow.Type.TimestampSecond: {
      // const ts = type as arrow.TimestampSecond
      return TypeDefinition.createDuckDBType({
        dataType: PseudoDataType.Unknown,
        typeName: 'timestamp[s]',
        // timezone: ts.timezone || undefined
      })
    }
    case arrow.Type.TimestampMicrosecond: {
      // const ts = type as arrow.TimestampMicrosecond
      return TypeDefinition.createDuckDBType({
        dataType: PseudoDataType.Unknown,
        typeName: 'timestamp[us]',
        // timezone: ts.timezone || undefined
      })
    }
    case arrow.Type.TimestampNanosecond: {
      // const ts = type as arrow.TimestampNanosecond
      return TypeDefinition.createDuckDBType({
        dataType: PseudoDataType.Unknown,
        typeName: 'timestamp[ns]',
        // timezone: ts.timezone || undefined
      })
    }
    case arrow.Type.TimestampMillisecond: {
      // const ts = type as arrow.TimestampMillisecond
      return TypeDefinition.createDuckDBType({
        dataType: PseudoDataType.Unknown,
        typeName: 'timestamp[ms]',
        // timezone: ts.timezone || undefined
      })
    }
    default: {
      console.warn(`unsupported arrow type: ${type.toString()}`)
      return TypeDefinition.createDuckDBType({
        dataType: PseudoDataType.Unknown,
        typeName: type.toString(),
      })
    }
  }
}
