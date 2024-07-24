import {
  type SchemaTreeColumnItem,
  SchemaTreeItemType,
  type SchemaTreeSchemaItem,
  type SchemaTreeTableItem,
  SqlDialect,
} from '@/lib/dialect/dialect'

export class PostgreSQLDialect extends SqlDialect {
  async getSchemaTree() {
    const schemas = await this.dataSource.query<Schema>(
      `SELECT DISTINCT schemaname FROM pg_catalog.pg_tables`,
    )

    const tables = await this.dataSource.query<Table>(
      `SELECT schemaname, tablename, tableowner FROM pg_catalog.pg_tables`,
    )

    const columns = await this.dataSource.query<Column>(
      `SELECT table_schema, table_name, column_name, data_type, is_nullable FROM information_schema.columns WHERE table_schema = 'public'`,
    )

    return genSchemas(schemas, tables, columns)
  }
}

type Schema = {
  schemaname: string
  tablename: string
  tableowner: string
}

type Table = {
  schemaname: string
  tablename: string
  tableowner: string
}

type Column = {
  table_catalog: string
  table_schema: string
  table_name: string
  column_name: string
  data_type: string
  is_nullable: 'YES' | 'NO'
}

function genSchemas(schemas: Schema[], tables: Table[], columns: Column[]) {
  const tree: Array<SchemaTreeSchemaItem> = []

  schemas.forEach((schema) => {
    const schemaItem: SchemaTreeSchemaItem = {
      name: schema.schemaname,
      type: SchemaTreeItemType.Schema,
      children: genTables(schema.schemaname, tables, columns),
    }

    tree.push(schemaItem)
  })

  return tree
}

function genTables(schema: string, tables: Table[], columns: Column[]) {
  const tree: Array<SchemaTreeTableItem> = []

  tables
    .filter((it) => it.schemaname === schema)
    .forEach((table) => {
      const tableItem: SchemaTreeTableItem = {
        name: table.tablename,
        type: SchemaTreeItemType.Table,
        children: genColumns(schema, table.tablename, columns),
      }

      tree.push(tableItem)
    })

  return tree
}

function genColumns(schema: string, table: string, columns: Column[]) {
  const tree: Array<SchemaTreeColumnItem> = []

  columns
    .filter((it) => it.table_schema === schema && it.table_name === table)
    .forEach((column) => {
      const columnItem: SchemaTreeColumnItem = {
        name: column.column_name,
        type: SchemaTreeItemType.Column,
        dataType: column.data_type,
        isNullable: column.is_nullable === 'YES',
      }

      tree.push(columnItem)
    })

  return tree
}
