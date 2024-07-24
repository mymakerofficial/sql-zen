import type { DataSourceFacade } from '@/lib/databases/database'

export const SchemaTreeItemType = {
  Catalog: 'catalog',
  Schema: 'schema',
  Tables: 'tables',
  Table: 'table',
  Column: 'column',
} as const
export type SchemaTreeItemType =
  (typeof SchemaTreeItemType)[keyof typeof SchemaTreeItemType]

export type SchemaTreeBaseItem = {
  name: string
  type: SchemaTreeItemType
}

export type SchemaTreeCatalogItem = SchemaTreeBaseItem & {
  type: typeof SchemaTreeItemType.Catalog
  children: SchemaTreeSchemaItem[]
}

export type SchemaTreeSchemaItem = SchemaTreeBaseItem & {
  type: typeof SchemaTreeItemType.Schema
  children: SchemaTreeItem[]
}

export type SchemaTreeTablesItem = SchemaTreeBaseItem & {
  type: typeof SchemaTreeItemType.Tables
  children: SchemaTreeColumnItem[]
}

export type SchemaTreeTableItem = SchemaTreeBaseItem & {
  type: typeof SchemaTreeItemType.Table
  children: SchemaTreeColumnItem[]
}

export type SchemaTreeColumnItem = SchemaTreeBaseItem & {
  type: typeof SchemaTreeItemType.Column
  dataType: string
  isNullable: boolean
}

export type SchemaTreeItem =
  | SchemaTreeCatalogItem
  | SchemaTreeSchemaItem
  | SchemaTreeTablesItem
  | SchemaTreeTableItem
  | SchemaTreeColumnItem

export abstract class SqlDialect {
  constructor(protected readonly dataSource: DataSourceFacade) {}

  abstract getSchemaTree(): Promise<SchemaTreeItem[]>
}

export class DummyDialect extends SqlDialect {
  async getSchemaTree() {
    return [] as SchemaTreeItem[]
  }
}
