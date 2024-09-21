import { DatabaseEngine } from '@/lib/engines/enums'
import {
  DataType,
  PseudoDataType,
  PseudoDataTypeDefinition,
  type WithPseudoTypes,
} from '@/lib/schema/columns/types/base'
import { SqliteTypeMap } from '@/lib/schema/columns/types/sqlite'
import {
  ArrowTypeToDuckDBTypeMap,
  DuckDBTypeMap,
} from '@/lib/schema/columns/types/duckdb'
import { getDataTypeDefinition } from '@/lib/schema/columns/types/helpers'
import { arrowTypeToTypeDefinition } from '@/lib/schema/columns/helpers/duckdb'
import * as arrow from 'apache-arrow'
import { pgUdtNameToDataType } from '@/lib/schema/columns/helpers/postgresql'

export type TypeInfo = {
  engine: DatabaseEngine
  /***
   * The internal data type, UNKNOWN if the type is not recognized.
   */
  dataType: WithPseudoTypes<DataType>
  /***
   * The name of the type as it would appear in the database.
   *
   * **Equivalent to**
   * | Database   |                            |
   * |------------|----------------------------|
   * | PostgreSQL | pg_catalog.pg_type.typname |
   * | DuckDB     | duckdb_types.type_name     |
   */
  typeName: string
  isNullable: boolean
  /***
   * The precision of numeric types, if applicable.
   */
  precision?: number
  /***
   * The scale of numeric types, if applicable.
   */
  scale?: number
  /***
   *  - if the type is a map, the type of the keys
   */
  keyType?: TypeInfo
  /***
   * - if the type is a collection, the type of the elements
   * - if the type is a map, the type of the values
   */
  valueType?: TypeInfo
  /***
   * - if the type is a row, list of fields
   */
  fields?: FieldInfo[]
}

export class TypeDefinition implements TypeInfo {
  static #theUnknown = TypeDefinition.from({
    engine: DatabaseEngine.None,
    dataType: PseudoDataType.Unknown,
    typeName: PseudoDataTypeDefinition[PseudoDataType.Unknown].name,
    isNullable: false,
  })

  #engine: DatabaseEngine
  #dataType: WithPseudoTypes<DataType>
  #typeName: string
  #isNullable: boolean
  #precision: number | undefined
  #scale: number | undefined
  #keyType: TypeDefinition | undefined
  #valueType: TypeDefinition | undefined
  #fields: FieldDefinition[] | undefined

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
    this.#fields = info.fields
      ? info.fields.map((it) => FieldDefinition.from(it))
      : undefined
  }

  static get Unknown() {
    return this.#theUnknown
  }

  static from(info: TypeInfo | TypeDefinition) {
    if ('getInfo' in info) {
      return info
    }
    return new TypeDefinition(info)
  }

  static createPostgresType(partialInfo: Omit<Partial<TypeInfo>, 'engine'>) {
    return this.from({
      engine: DatabaseEngine.PostgreSQL,
      dataType: PseudoDataType.Unknown,
      typeName: '',
      isNullable: false,
      ...partialInfo,
    })
  }

  static createDuckDBType(partialInfo: Omit<Partial<TypeInfo>, 'engine'>) {
    return this.from({
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

  toField(field: Omit<FieldInfo, keyof TypeInfo>): FieldDefinition {
    return FieldDefinition.from({
      ...this.toTypeInfo(),
      ...field,
    })
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

  get fields() {
    return this.#fields
  }

  getTypeDisplayName() {
    if (this.dataType === PseudoDataType.Unknown) {
      return this.typeName
    }

    const def = getDataTypeDefinition(this.engine, this.dataType)

    if (!def.displayName) {
      return def.name ?? this.typeName
    }

    if (typeof def.displayName === 'function') {
      return def.displayName(this)
    }

    return def.displayName
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
      fields: this.fields?.map((it) => it.toFieldInfo()),
    }
  }

  getInfo(): TypeInfo {
    return this.toTypeInfo()
  }

  toString() {
    return this.getTypeDisplayName()
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
    return TypeDefinition.fromArrowType(field.type).toField({
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

  toString() {
    return `${this.name} ${this.getTypeDisplayName()}`
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

  toString() {
    return `${this.tableName}.${this.name} ${this.getTypeDisplayName()}`
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
