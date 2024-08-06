import type {
  DSTreeColumnItem,
  DSTreeSchemaItem,
  DSTreeTableItem,
  ISqlDialect,
} from '@/lib/dialect/interface'
import { DSTreeItemType } from '@/lib/dialect/enums'
import { SqlDialect } from '@/lib/dialect/impl/base'

export class PostgreSQLDialect extends SqlDialect implements ISqlDialect {
  async getDataSourceTree() {
    const { rows: schemas } = await this.dataSource.query<Schema>(
      `SELECT nspname, oid FROM pg_namespace ORDER BY oid DESC`,
    )

    const { rows: tables } = await this.dataSource.query<Table>(
      `SELECT schemaname, tablename, tableowner FROM pg_catalog.pg_tables`,
    )

    const { rows: columns } = await this.dataSource.query<Column>(
      `SELECT table_schema, table_name, column_name, data_type, is_nullable FROM information_schema.columns WHERE table_schema = 'public'`,
    )

    return [
      {
        key: '__schemas__',
        name: 'schemas',
        type: DSTreeItemType.Collection,
        for: DSTreeItemType.Schema,
        children: genSchemas(schemas, tables, columns),
      },
    ]
  }

  async beginTransaction(): Promise<void> {
    await this.dataSource.query(`BEGIN`)
  }

  async commitTransaction(): Promise<void> {
    await this.dataSource.query(`COMMIT`)
  }

  async rollbackTransaction(): Promise<void> {
    await this.dataSource.query(`ROLLBACK`)
  }
}

type Schema = {
  nspname: string
  oid: number
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

function genSchemas(
  schemas: Schema[],
  tables: Table[],
  columns: Column[],
): DSTreeSchemaItem[] {
  return schemas.map((schema) => ({
    key: `__schemas__-${schema.nspname}`,
    name: schema.nspname,
    type: DSTreeItemType.Schema,
    children: [
      {
        key: `${schema.nspname}__tables__`,
        name: 'tables',
        type: DSTreeItemType.Collection,
        for: DSTreeItemType.Table,
        children: genTables(schema.nspname, tables, columns),
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
    .filter((it) => it.schemaname === schema)
    .map((table) => ({
      key: `${schema}-${table.tablename}`,
      name: table.tablename,
      type: DSTreeItemType.Table,
      children: genColumns(schema, table.tablename, columns),
    }))
}

function genColumns(
  schema: string,
  table: string,
  columns: Column[],
): DSTreeColumnItem[] {
  return columns
    .filter((it) => it.table_schema === schema && it.table_name === table)
    .map((column) => ({
      key: `${schema}-${table}-${column.column_name}`,
      name: column.column_name,
      type: DSTreeItemType.Column,
      dataType: column.data_type,
      isNullable: column.is_nullable === 'YES',
    }))
}
