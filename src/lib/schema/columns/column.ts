import { DatabaseEngine } from '@/lib/engines/enums'
import {
  DataType,
  type DataTypeFromEngine,
  PseudoDataType,
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

export type FieldInfo<T extends DatabaseEngine = DatabaseEngine> = {
  engine: T
  name: string
  dataType: WithPseudoTypes<DataTypeFromEngine<T>>
  isNullable: boolean
}

export class FieldDefinition<T extends DatabaseEngine = DatabaseEngine>
  implements FieldInfo<T>
{
  #engine: T
  #name: string
  #dataType: WithPseudoTypes<DataTypeFromEngine<T>>
  #isNullable: boolean

  constructor(info: FieldInfo<T>) {
    this.#engine = info.engine
    this.#name = info.name
    this.#dataType = info.dataType
    this.#isNullable = info.isNullable
  }

  static from<T extends DatabaseEngine = typeof DatabaseEngine.None>(
    info: FieldInfo<T>,
  ) {
    return new FieldDefinition(info)
  }

  static fromUnknown(name: string) {
    return this.from({
      engine: DatabaseEngine.None,
      name,
      dataType: PseudoDataType.Unknown,
      isNullable: false,
    })
  }

  static fromPGNameAndUDTName(name: string, udtName: string) {
    return this.from({
      engine: DatabaseEngine.PostgreSQL,
      name,
      dataType: pgUdtNameToDataType(udtName),
      isNullable: false,
    })
  }

  static fromSqliteNameAndType(name: string, type: string) {
    return this.from({
      engine: DatabaseEngine.SQLite,
      name,
      // @ts-expect-error
      dataType: SqliteTypeMap[type.toLowerCase()] ?? PseudoDataType.Unknown,
      isNullable: false,
    })
  }

  static fromDuckDBNameAndType(name: string, type: string) {
    return this.from({
      engine: DatabaseEngine.DuckDB,
      name,
      // @ts-expect-error
      dataType: DuckDBTypeMap[type.toUpperCase()] ?? PseudoDataType.Unknown,
      isNullable: false,
    })
  }

  static fromDuckDBNameAndArrowType(name: string, type: string) {
    return this.from({
      engine: DatabaseEngine.DuckDB,
      name,
      // @ts-expect-error
      dataType: ArrowTypeToDuckDBTypeMap[type] ?? PseudoDataType.Unknown,
      isNullable: false,
    })
  }

  get engine() {
    return this.#engine
  }

  get name() {
    return this.#name
  }

  get dataType() {
    return this.#dataType
  }

  get isNullable() {
    return this.#isNullable
  }

  getDataTypeDisplayName() {
    return getDataTypeDisplayName(
      this.engine,
      this.dataType as WithPseudoTypes<DataType>,
    )
  }

  toFieldInfo(): FieldInfo<T> {
    return {
      engine: this.engine,
      name: this.name,
      dataType: this.dataType,
      isNullable: this.isNullable,
    }
  }

  getInfo(): FieldInfo<T> {
    return this.toFieldInfo()
  }
}

export type ColumnDefinitionInfo<T extends DatabaseEngine = DatabaseEngine> =
  FieldInfo<T> & {
    databaseName: string
    schemaName: string
    tableName: string
  }

export class ColumnDefinition<T extends DatabaseEngine = DatabaseEngine>
  extends FieldDefinition<T>
  implements ColumnDefinitionInfo<T>
{
  readonly #databaseName: string
  readonly #schemaName: string
  readonly #tableName: string

  constructor(info: ColumnDefinitionInfo<T>) {
    super(info)
    this.#databaseName = info.databaseName
    this.#schemaName = info.schemaName
    this.#tableName = info.tableName
  }

  static from<T extends DatabaseEngine = typeof DatabaseEngine.None>(
    info: ColumnDefinitionInfo<T>,
  ) {
    return new ColumnDefinition(info)
  }

  static fromField<T extends DatabaseEngine = typeof DatabaseEngine.None>(
    info: FieldInfo<T>,
  ) {
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
      isNullable: column.is_nullable === 'YES',
    })
  }

  static fromUnknown(name: string) {
    return this.fromField({
      engine: DatabaseEngine.None,
      name,
      dataType: PseudoDataType.Unknown,
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

  getInfo(): ColumnDefinitionInfo<T> {
    return {
      ...this.toFieldInfo(),
      databaseName: this.databaseName,
      schemaName: this.schemaName,
      tableName: this.tableName,
    }
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
