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
}

export class FieldDefinition<T extends DatabaseEngine = DatabaseEngine>
  implements FieldInfo<T>
{
  readonly #engine: T
  readonly #name: string
  readonly #dataType: WithPseudoTypes<DataTypeFromEngine<T>>

  constructor(info: FieldInfo<T>) {
    this.#engine = info.engine
    this.#name = info.name
    this.#dataType = info.dataType
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
    })
  }

  static fromPGNameAndUDTName(name: string, udtName: string) {
    return this.from({
      engine: DatabaseEngine.PostgreSQL,
      name,
      dataType: pgUdtNameToDataType(udtName),
    })
  }

  static fromSqliteNameAndType(name: string, type: string) {
    return this.from({
      engine: DatabaseEngine.SQLite,
      name,
      // @ts-expect-error
      dataType: SqliteTypeMap[type.toLowerCase()] ?? PseudoDataType.Unknown,
    })
  }

  static fromDuckDBNameAndType(name: string, type: string) {
    return this.from({
      engine: DatabaseEngine.DuckDB,
      name,
      // @ts-expect-error
      dataType: DuckDBTypeMap[type.toUpperCase()] ?? PseudoDataType.Unknown,
    })
  }

  static fromDuckDBNameAndArrowType(name: string, type: string) {
    return this.from({
      engine: DatabaseEngine.DuckDB,
      name,
      // @ts-expect-error
      dataType: ArrowTypeToDuckDBTypeMap[type] ?? PseudoDataType.Unknown,
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
    }
  }

  getInfo(): FieldInfo<T> {
    return this.toFieldInfo()
  }
}

export type ColumnDefinitionInfo<T extends DatabaseEngine = DatabaseEngine> =
  FieldInfo<T> & {
    isNullable: boolean
  }

export class ColumnDefinition<T extends DatabaseEngine = DatabaseEngine>
  extends FieldDefinition<T>
  implements ColumnDefinitionInfo<T>
{
  readonly #isNullable: boolean

  constructor(info: ColumnDefinitionInfo<T>) {
    super(info)
    this.#isNullable = info.isNullable
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
      isNullable: true,
    })
  }

  static fromPGInformationSchemaColumn(
    column: PostgreSQLInformationSchemaColumn,
  ) {
    return this.from({
      engine: DatabaseEngine.PostgreSQL,
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
    })
  }

  get isNullable() {
    return this.#isNullable
  }

  getInfo(): ColumnDefinitionInfo<T> {
    return {
      ...this.toFieldInfo(),
      isNullable: this.isNullable,
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
