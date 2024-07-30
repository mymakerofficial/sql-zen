import type {
  ISqlDialect,
  DSTreeColumnItem,
  DSTreeTableItem,
  DSTreeCollectionItem,
  DSTreeFunctionItem,
  DSTreeSchemaItem,
} from '@/lib/dialect/interface'
import { DSTreeItemType } from '@/lib/dialect/enums'
import { SqlDialect } from '@/lib/dialect/impl/base'

export class SQLiteDialect extends SqlDialect implements ISqlDialect {
  async getDataSourceTree() {
    const { rows: schemas } = await this.dataSource.query<Schema>(
      `SELECT DISTINCT schema AS name FROM pragma_table_list`,
    )

    const { rows: tables } = await this.dataSource.query<Table>(
      `SELECT schema, name, type FROM pragma_table_list WHERE type = 'table'`,
    )

    const { rows: columns } = await this.dataSource.query<Column>(
      `SELECT t.schema AS schemaname, t.name AS tablename, c.* FROM pragma_table_list AS t JOIN pragma_table_info(t.name) AS c WHERE t.type = 'table' ORDER BY c.cid`,
    )

    const { rows: functions } = await this.dataSource.query<Function>(
      `SELECT name FROM pragma_function_list`,
    )

    return [
      {
        key: '__schemas__',
        name: 'schemas',
        type: DSTreeItemType.Collection,
        for: DSTreeItemType.Schema,
        children: genSchemas(schemas, tables, columns),
      },
      {
        key: '__functions__',
        name: 'functions',
        type: DSTreeItemType.Collection,
        for: DSTreeItemType.Function,
        children: genFunctions(functions),
      },
    ] as unknown as DSTreeCollectionItem[]
  }
}

type Schema = {
  name: string
}

type Table = {
  schema: string
  name: string
  type: string
}

type Column = {
  schamaname: string
  tablename: string
  cid: number
  name: string
  type: string
  notnull: number
  dflt_value: string | null
  pk: number
}

type Function = {
  name: string
}

function genSchemas(
  schemas: Schema[],
  tables: Table[],
  columns: Column[],
): DSTreeSchemaItem[] {
  return schemas.map((schema) => ({
    key: schema.name,
    name: schema.name,
    type: DSTreeItemType.Schema,
    children: [
      {
        key: `__schemas__-${schema.name}`,
        name: 'tables',
        type: DSTreeItemType.Collection,
        for: DSTreeItemType.Table,
        children: genTables(schema.name, tables, columns),
      },
    ],
  }))
}

function genTables(
  schema: string,
  tables: Table[],
  columns: Column[],
): DSTreeTableItem[] {
  return tables
    .filter((it) => it.schema === schema)
    .map((table) => ({
      key: `${schema}-${table.name}`,
      name: table.name,
      type: DSTreeItemType.Table,
      children: [
        {
          key: `${schema}-${table.name}-__columns__`,
          name: 'columns',
          type: DSTreeItemType.Collection,
          for: DSTreeItemType.Column,
          children: genColumns(schema, table.name, columns),
        },
      ],
    }))
}

function genColumns(
  schema: string,
  table: string,
  columns: Column[],
): DSTreeColumnItem[] {
  return columns
    .filter((it) => it.tablename === table)
    .map((column) => ({
      key: `${schema}-${table}-${column.name}`,
      name: column.name,
      type: DSTreeItemType.Column,
      dataType: column.type,
      isNullable: column.notnull !== 1,
    }))
}

function genFunctions(functions: Function[]): DSTreeFunctionItem[] {
  return functions.map((func) => ({
    key: `__functions__-${func.name}`,
    name: func.name,
    type: DSTreeItemType.Function,
    description: '',
  }))
}
