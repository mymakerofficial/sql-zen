import {
  ColumnDefinition,
  type ColumnDefinitionInfo,
} from '@/lib/schema/columns/definition/base'
import { DatabaseEngine } from '@/lib/engines/enums'
import { SqliteTypeMap } from '@/lib/schema/columns/types/sqlite'
import { PseudoDataType } from '@/lib/schema/columns/types/base'

export class SQLiteColumnDefinition extends ColumnDefinition<
  typeof DatabaseEngine.SQLite
> {
  constructor(info: ColumnDefinitionInfo<typeof DatabaseEngine.SQLite>) {
    super(info)
  }

  static fromNameAndType(name: string, type: string): SQLiteColumnDefinition {
    return this.fromFieldInfo({
      engine: DatabaseEngine.SQLite,
      name,
      // @ts-expect-error
      dataType: SqliteTypeMap[type] ?? PseudoDataType.Unknown,
    })
  }
}
