import { DatabaseEngine } from '@/lib/engines/enums'
import {
  DataType,
  PseudoDataType,
  PseudoDataTypeDefinition,
  type WithPseudoTypes,
} from '@/lib/schema/columns/types/base'
import { SqliteTypeMap } from '@/lib/schema/columns/types/sqlite'
import {
  type PostgresDataType,
  PostgresUDTNameDataTypeMap,
} from '@/lib/schema/columns/types/postgresql'
import {
  ArrowTypeToDuckDBTypeMap,
  DuckDBTypeMap,
} from '@/lib/schema/columns/types/duckdb'
import { getDataTypeDisplayName } from '@/lib/schema/columns/types/helpers'
import { arrowTypeToTypeDefinition } from '@/lib/schema/columns/helpers/duckdb'
import * as arrow from 'apache-arrow'

export type TypeInfo = {
  engine: DatabaseEngine
  // internal data type, UNKNOWN if the type is not recognized
  dataType: WithPseudoTypes<DataType>
  // the name of the type as it would appear in the database
  typeName: string
  isNullable: boolean
  // the precision of the type, if applicable
  precision?: number
  // the scale of the type, if applicable
  scale?: number
  // - if the type is a map, the type of the keys
  keyType?: TypeInfo
  // - if the type is a collection, the type of the elements
  // - if the type is a map, the type of the values
  valueType?: TypeInfo
}

export class TypeDefinition implements TypeInfo {
  #engine: DatabaseEngine
  #dataType: WithPseudoTypes<DataType>
  #typeName: string
  #isNullable: boolean
  #precision: number | undefined
  #scale: number | undefined
  #keyType: TypeDefinition | undefined
  #valueType: TypeDefinition | undefined

  constructor(info: TypeInfo) {
    this.#engine = info.engine
    this.#dataType = info.dataType
    this.#typeName = info.typeName
    this.#isNullable = info.isNullable
    this.#precision = info.precision
    this.#scale = info.scale
    this.#keyType = info.keyType ? TypeDefinition.from(info.keyType) : undefined
    this.#valueType = info.valueType
      ? TypeDefinition.from(info.valueType)
      : undefined
  }

  static from(info: TypeInfo) {
    return new TypeDefinition(info)
  }

  static createDuckDBType(partialInfo: Omit<Partial<TypeInfo>, 'engine'>) {
    return new TypeDefinition({
      engine: DatabaseEngine.DuckDB,
      dataType: PseudoDataType.Unknown,
      typeName: '',
      isNullable: false,
      ...partialInfo,
    })
  }

  static fromArrowType(type: arrow.DataType): TypeDefinition {
    return arrowTypeToTypeDefinition(type)
  }

  get engine() {
    return this.#engine
  }

  get dataType() {
    return this.#dataType
  }

  get typeName() {
    return this.#typeName
  }

  get isNullable() {
    return this.#isNullable
  }

  get precision() {
    return this.#precision
  }

  get scale() {
    return this.#scale
  }

  get keyType() {
    return this.#keyType
  }

  get valueType() {
    return this.#valueType
  }

  getDataTypeDisplayName() {
    return getDataTypeDisplayName(this.engine, this.dataType, this.typeName)
  }

  toTypeInfo(): TypeInfo {
    return {
      engine: this.engine,
      dataType: this.dataType,
      typeName: this.typeName,
      isNullable: this.isNullable,
      precision: this.precision,
      scale: this.scale,
      keyType: this.keyType?.toTypeInfo(),
      valueType: this.valueType?.toTypeInfo(),
    }
  }

  getInfo(): TypeInfo {
    return this.toTypeInfo()
  }
}

export type FieldInfo = TypeInfo & {
  name: string
}

export class FieldDefinition extends TypeDefinition implements FieldInfo {
  #name: string

  constructor(info: FieldInfo) {
    super(info)
    this.#name = info.name
  }

  static from(info: FieldInfo) {
    return new FieldDefinition(info)
  }

  static fromUnknown(name: string) {
    return this.from({
      engine: DatabaseEngine.None,
      name,
      dataType: PseudoDataType.Unknown,
      typeName: PseudoDataTypeDefinition[PseudoDataType.Unknown].name,
      isNullable: false,
    })
  }

  static fromPGNameAndUDTName(name: string, udtName: string) {
    return this.from({
      engine: DatabaseEngine.PostgreSQL,
      name,
      dataType: pgUdtNameToDataType(udtName),
      typeName: udtName,
      isNullable: false,
    })
  }

  static fromSqliteNameAndType(name: string, type: string) {
    return this.from({
      engine: DatabaseEngine.SQLite,
      name,
      // @ts-expect-error
      dataType: SqliteTypeMap[type.toLowerCase()] ?? PseudoDataType.Unknown,
      typeName: type,
      isNullable: false,
    })
  }

  static fromArrowField(field: arrow.Field) {
    return this.from({
      ...TypeDefinition.fromArrowType(field.type).toTypeInfo(),
      name: field.name,
    })
  }

  // @deprecated
  static fromDuckDBNameAndType(name: string, type: string) {
    return this.from({
      engine: DatabaseEngine.DuckDB,
      name,
      // @ts-expect-error
      dataType: DuckDBTypeMap[type.toUpperCase()] ?? PseudoDataType.Unknown,
      typeName: type,
      isNullable: false,
    })
  }

  // @deprecated
  static fromDuckDBNameAndArrowType(name: string, type: string) {
    return this.from({
      engine: DatabaseEngine.DuckDB,
      name,
      // @ts-expect-error
      dataType: ArrowTypeToDuckDBTypeMap[type] ?? PseudoDataType.Unknown,
      typeName: type,
      isNullable: false,
    })
  }

  get name() {
    return this.#name
  }

  toFieldInfo(): FieldInfo {
    return {
      ...this.toTypeInfo(),
      name: this.name,
    }
  }

  getInfo(): FieldInfo {
    return this.toFieldInfo()
  }
}

export type ColumnDefinitionInfo = FieldInfo & {
  databaseName: string
  schemaName: string
  tableName: string
}

export class ColumnDefinition
  extends FieldDefinition
  implements ColumnDefinitionInfo
{
  readonly #databaseName: string
  readonly #schemaName: string
  readonly #tableName: string

  constructor(info: ColumnDefinitionInfo) {
    super(info)
    this.#databaseName = info.databaseName
    this.#schemaName = info.schemaName
    this.#tableName = info.tableName
  }

  static from(info: ColumnDefinitionInfo) {
    return new ColumnDefinition(info)
  }

  static fromField(info: FieldInfo) {
    return this.from({
      ...info,
      databaseName: '',
      schemaName: '',
      tableName: '',
    })
  }

  static fromPGInformationSchemaColumn(
    column: PostgreSQLInformationSchemaColumn,
  ) {
    return this.from({
      engine: DatabaseEngine.PostgreSQL,
      databaseName: column.table_catalog,
      schemaName: column.table_schema,
      tableName: column.table_name,
      name: column.column_name,
      dataType: pgUdtNameToDataType(column.udt_name),
      typeName: column.udt_name,
      isNullable: column.is_nullable === 'YES',
    })
  }

  static fromUnknown(name: string) {
    return this.fromField({
      engine: DatabaseEngine.None,
      name,
      dataType: PseudoDataType.Unknown,
      typeName: PseudoDataTypeDefinition[PseudoDataType.Unknown].name,
      isNullable: false,
    })
  }

  get databaseName() {
    return this.#databaseName
  }

  get schemaName() {
    return this.#schemaName
  }

  get tableName() {
    return this.#tableName
  }

  toColumnDefinitionInfo(): ColumnDefinitionInfo {
    return {
      ...this.toFieldInfo(),
      databaseName: this.databaseName,
      schemaName: this.schemaName,
      tableName: this.tableName,
    }
  }

  getInfo(): ColumnDefinitionInfo {
    return this.toColumnDefinitionInfo()
  }
}

export type PostgreSQLInformationSchemaColumn = {
  table_catalog: string
  table_schema: string
  table_name: string
  column_name: string
  udt_name: string
  is_nullable: 'YES' | 'NO'
}

function pgUdtNameToDataType(
  udtName: string,
): WithPseudoTypes<PostgresDataType> {
  // @ts-expect-error
  const dataType = PostgresUDTNameDataTypeMap[udtName.toLowerCase()]

  if (!dataType) {
    console.warn(`Unknown PostgreSQL data type: ${udtName}`)
    return PseudoDataType.Unknown
  }

  return dataType
}
