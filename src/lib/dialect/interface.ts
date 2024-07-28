import type { SchemaTreeItemType } from '@/lib/dialect/enums'

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

export interface ISqlDialect {
  getSchemaTree(): Promise<SchemaTreeItem[]>
}
