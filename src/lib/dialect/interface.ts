import type { DSTreeItemType } from '@/lib/dialect/enums'

export type DSTreeBaseItem = {
  key: string
  name: string
  type: DSTreeItemType
}

export type DSTreeCollectionItem = DSTreeBaseItem & {
  type: typeof DSTreeItemType.Collection
  for: DSTreeItemType
  children: DSTreeItem[]
}

export type DSTreeExtensionItem = DSTreeBaseItem & {
  type: typeof DSTreeItemType.Extension
  loaded: boolean
  installed: boolean
  description: string
}

export type DSTreeDatabaseItem = DSTreeBaseItem & {
  type: typeof DSTreeItemType.Database
  children: DSTreeItem[]
  path: string
}

export type DSTreeSchemaItem = DSTreeBaseItem & {
  type: typeof DSTreeItemType.Schema
  children: DSTreeItem[]
}

export type DSTreeTableItem = DSTreeBaseItem & {
  type: typeof DSTreeItemType.Table
  children: DSTreeItem[]
}

export type DSTreeViewItem = DSTreeBaseItem & {
  type: typeof DSTreeItemType.View
  children: DSTreeItem[]
}

export type DSTreeFunctionItem = DSTreeBaseItem & {
  type: typeof DSTreeItemType.Function
  description: string
}

export type DSTreeColumnItem = DSTreeBaseItem & {
  type: typeof DSTreeItemType.Column
  dataType: string
  isNullable: boolean
}

export type DSTreeItem =
  | DSTreeExtensionItem
  | DSTreeDatabaseItem
  | DSTreeSchemaItem
  | DSTreeCollectionItem
  | DSTreeTableItem
  | DSTreeViewItem
  | DSTreeFunctionItem
  | DSTreeColumnItem
