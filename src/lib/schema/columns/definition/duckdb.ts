import {
  ColumnDefinition,
  type ColumnDefinitionInfo,
} from '@/lib/schema/columns/definition/base'
import { DatabaseEngine } from '@/lib/engines/enums'
import { PseudoDataType } from '@/lib/schema/columns/types/base'
import { DuckDBTypeMap } from '@/lib/schema/columns/types/duckdb'

export class DuckDBColumnDefinition extends ColumnDefinition<
  typeof DatabaseEngine.DuckDB
> {
  constructor(info: ColumnDefinitionInfo<typeof DatabaseEngine.DuckDB>) {
    super(info)
  }

  static fromNameAndType(name: string, type: string): DuckDBColumnDefinition {
    return this.fromFieldInfo({
      engine: DatabaseEngine.DuckDB,
      name,
      // @ts-expect-error
      dataType: DuckDBTypeMap[type] ?? PseudoDataType.Unknown,
    })
  }
}
