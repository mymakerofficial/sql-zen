import { DatabaseEngine } from '@/lib/engines/enums'
import {
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

export type FieldInfo<T extends DatabaseEngine = DatabaseEngine> = {
  engine: T
  name: string
  dataType: WithPseudoTypes<DataTypeFromEngine<T>>
}

export type ColumnDefinitionInfo<T extends DatabaseEngine = DatabaseEngine> =
  FieldInfo<T> & {
    isNullable: boolean
    isPrimaryKey: boolean
    isUnique: boolean
  }

export class ColumnDefinition<T extends DatabaseEngine = DatabaseEngine>
  implements ColumnDefinitionInfo<T>
{
  readonly #engine: T
  readonly #name: string
  readonly #dataType: WithPseudoTypes<DataTypeFromEngine<T>>
  readonly #isNullable: boolean
  readonly #isPrimaryKey: boolean
  readonly #isUnique: boolean

  constructor(info: ColumnDefinitionInfo<T>) {
    this.#engine = info.engine
    this.#name = info.name
    this.#dataType = info.dataType
    this.#isNullable = info.isNullable
    this.#isPrimaryKey = info.isPrimaryKey
    this.#isUnique = info.isUnique
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
      isPrimaryKey: false,
      isUnique: false,
    })
  }

  static fromUnknown(name: string) {
    return this.fromField({
      engine: DatabaseEngine.None,
      name,
      dataType: PseudoDataType.Unknown,
    })
  }

  static fromPGNameAndUDTName(name: string, udtName: string) {
    return this.fromField({
      engine: DatabaseEngine.PostgreSQL,
      name,
      dataType: pgUdtNameToDataType(udtName),
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
      isPrimaryKey: false,
      isUnique: false,
    })
  }

  static fromSqliteNameAndType(name: string, type: string) {
    return this.fromField({
      engine: DatabaseEngine.SQLite,
      name,
      // @ts-expect-error
      dataType: SqliteTypeMap[type.toLowerCase()] ?? PseudoDataType.Unknown,
    })
  }

  static fromDuckDBNameAndType(name: string, type: string) {
    return this.fromField({
      engine: DatabaseEngine.DuckDB,
      name,
      // @ts-expect-error
      dataType: DuckDBTypeMap[type.toUpperCase()] ?? PseudoDataType.Unknown,
    })
  }

  static fromDuckDBNameAndArrowType(name: string, type: string) {
    return this.fromField({
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

  get isNullable() {
    return this.#isNullable
  }

  get isPrimaryKey() {
    return this.#isPrimaryKey
  }

  get isUnique() {
    return this.#isUnique
  }

  toFieldInfo(): FieldInfo<T> {
    return {
      engine: this.engine,
      name: this.name,
      dataType: this.dataType,
    }
  }

  getInfo(): ColumnDefinitionInfo<T> {
    return {
      ...this.toFieldInfo(),
      isNullable: this.isNullable,
      isPrimaryKey: this.isPrimaryKey,
      isUnique: this.isUnique,
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
