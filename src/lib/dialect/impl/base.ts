import type { ISqlDialect, SchemaTreeItem } from '@/lib/dialect/interface'
import type { IDataSource } from '@/lib/dataSources/interface'

export abstract class SqlDialect implements ISqlDialect {
  protected dataSource: IDataSource

  constructor(dataSource: IDataSource) {
    this.dataSource = dataSource
  }

  abstract getSchemaTree(): Promise<SchemaTreeItem[]>
}
