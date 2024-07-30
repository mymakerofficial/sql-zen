export const DSTreeItemType = {
  Collection: 'collection',
  Extension: 'extension',
  Database: 'database',
  Schema: 'schema',
  Table: 'table',
  View: 'view',
  Function: 'function',
  Column: 'column',
} as const
export type DSTreeItemType =
  (typeof DSTreeItemType)[keyof typeof DSTreeItemType]
