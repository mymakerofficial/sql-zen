export const SchemaTreeItemType = {
  Catalog: 'catalog',
  Schema: 'schema',
  Tables: 'tables',
  Table: 'table',
  Column: 'column',
} as const
export type SchemaTreeItemType =
  (typeof SchemaTreeItemType)[keyof typeof SchemaTreeItemType]
