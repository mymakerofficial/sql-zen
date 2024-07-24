import {
  type SchemaTreeColumnItem,
  SchemaTreeItemType,
  type SchemaTreeSchemaItem,
  type SchemaTreeTableItem,
  SqlDialect,
} from '@/lib/dialect/dialect'

export class SQLiteDialect extends SqlDialect {
  async getSchemaTree() {
    const tables = await this.dataSource.query<Table>(
      `SELECT name FROM sqlite_master WHERE type = 'table'`,
    )

    const columns = await Promise.all(
      tables.map((table) => {
        // return query result and table name
        return this.dataSource
          .query<Omit<Column, 'tablename'>>(`PRAGMA table_info(${table.name})`)
          .then((columns) =>
            columns.map((column) => ({
              ...column,
              tablename: table.name,
            })),
          )
      }),
    ).then((results) => results.flat())

    return genTables(tables, columns)
  }
}

type Table = {
  name: string
}

type Column = {
  tablename: string
  cid: number
  name: string
  type: string
  notnull: number
  dflt_value: string | null
  pk: number
}

function genTables(tables: Table[], columns: Column[]) {
  const tree: Array<SchemaTreeTableItem> = []

  tables.forEach((table) => {
    const tableItem: SchemaTreeTableItem = {
      name: table.name,
      type: SchemaTreeItemType.Table,
      children: genColumns(table.name, columns),
    }

    tree.push(tableItem)
  })

  return tree
}

function genColumns(table: string, columns: Column[]) {
  const tree: Array<SchemaTreeColumnItem> = []

  columns
    .filter((it) => it.tablename === table)
    .forEach((column) => {
      const columnItem: SchemaTreeColumnItem = {
        name: column.name,
        type: SchemaTreeItemType.Column,
        dataType: column.type,
        isNullable: column.notnull !== 1,
      }

      tree.push(columnItem)
    })

  return tree
}
