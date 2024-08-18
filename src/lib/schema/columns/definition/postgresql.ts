import {
  ColumnDefinition,
  type ColumnDefinitionInfo,
} from '@/lib/schema/columns/definition/base'
import { DatabaseEngine } from '@/lib/engines/enums'
import {
  type PostgresDataType,
  PostgresUDTNameDataTypeMap,
} from '@/lib/schema/columns/types/postgresql'
import {
  PseudoDataType,
  type WithPseudoTypes,
} from '@/lib/schema/columns/types/base'

export type PostgreSQLInformationSchemaColumn = {
  table_catalog: string
  table_schema: string
  table_name: string
  column_name: string
  udt_name: string
  is_nullable: 'YES' | 'NO'
}

export class PostgreSQLColumnDefinition extends ColumnDefinition<
  typeof DatabaseEngine.PostgreSQL
> {
  constructor(info: ColumnDefinitionInfo<typeof DatabaseEngine.PostgreSQL>) {
    super(info)
  }

  static fromNameAndUDTName(
    name: string,
    udtName: string,
  ): PostgreSQLColumnDefinition {
    return new PostgreSQLColumnDefinition({
      engine: DatabaseEngine.PostgreSQL,
      name,
      dataType: udtNameToDataType(udtName),
      isNullable: true,
      isPrimaryKey: false,
      isUnique: false,
    })
  }

  static fromInformationSchemaColumn(
    column: PostgreSQLInformationSchemaColumn,
  ): PostgreSQLColumnDefinition {
    return new PostgreSQLColumnDefinition({
      engine: DatabaseEngine.PostgreSQL,
      name: column.column_name,
      dataType: udtNameToDataType(column.udt_name),
      isNullable: column.is_nullable === 'YES',
      isPrimaryKey: false,
      isUnique: false,
    })
  }
}

function udtNameToDataType(udtName: string): WithPseudoTypes<PostgresDataType> {
  // @ts-expect-error
  const dataType = PostgresUDTNameDataTypeMap[udtName.toLowerCase()]

  if (!dataType) {
    console.warn(`Unknown PostgreSQL data type: ${udtName}`)
    return PseudoDataType.Unknown
  }

  return dataType
}
