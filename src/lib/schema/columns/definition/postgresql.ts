import {
  ColumnDefinition,
  type ColumnDefinitionInfo,
} from '@/lib/schema/columns/definition/base'
import { DatabaseEngine } from '@/lib/engines/enums'
import {
  PostgesDataTypeIdMap,
  type PostgresDataType,
} from '@/lib/schema/columns/types/postgresql'
import {
  PseudoDataType,
  type WithPseudoTypes,
} from '@/lib/schema/columns/types/base'

export class PostgreSQLColumnDefinition extends ColumnDefinition<
  typeof DatabaseEngine.PostgreSQL
> {
  constructor(info: ColumnDefinitionInfo<typeof DatabaseEngine.PostgreSQL>) {
    super(info)
  }

  static fromNameAndTypeId(
    name: string,
    typeId: number,
  ): PostgreSQLColumnDefinition {
    return new PostgreSQLColumnDefinition({
      engine: DatabaseEngine.PostgreSQL,
      name,
      dataType: dataTypeIdToDataType(typeId),
      nullable: false,
      primary: false,
      unique: false,
    })
  }
}

function dataTypeIdToDataType(
  typeId: number,
): WithPseudoTypes<PostgresDataType> {
  // @ts-expect-error
  const dataType = PostgesDataTypeIdMap[typeId]

  if (!dataType) {
    console.warn(`Unknown PostgreSQL data type ID: ${typeId}`)
    return PseudoDataType.Unknown
  }

  return dataType
}
