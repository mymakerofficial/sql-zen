import type {
  DSTreeCollectionItem,
  DSTreeColumnItem,
  DSTreeExtensionItem,
  DSTreeSchemaItem,
  DSTreeTableItem,
} from '@/lib/dialect/interface'
import { DSTreeItemType } from '@/lib/dialect/enums'
import { SqlDialect } from '@/lib/dialect/impl/base'
import {
  ColumnDefinition,
  type ColumnDefinitionInfo,
  type PostgreSQLInformationSchemaColumn,
} from '@/lib/schema/columns/definition/base'

export class PostgreSQLDialect extends SqlDialect {
  async getDataSourceTree() {
    const { rows: extensions } = await this.dataSource.query<Extension>(
      `SELECT e.extname, e.extversion, d.description FROM pg_catalog.pg_extension as e LEFT JOIN pg_catalog.pg_description as d ON e.oid = d.objoid`,
    )

    const { rows: schemas } = await this.dataSource.query<Schema>(
      `SELECT nspname, oid FROM pg_catalog.pg_namespace ORDER BY oid DESC`,
    )

    const { rows: tables } = await this.dataSource.query<Table>(
      `SELECT schemaname, tablename, tableowner FROM pg_catalog.pg_tables`,
    )

    const { rows: columns } = await this.dataSource.query<Column>(
      `SELECT table_schema, table_name, column_name, udt_name, is_nullable FROM information_schema.columns`,
    )

    return genBase(extensions, schemas, tables, columns)
  }

  async getPublicTableNames() {
    const { rows } = await this.dataSource.query<{ tablename: string }>(
      `SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public'`,
    )
    return rows.map((it) => it.tablename)
  }

  async getTableColumns(tableName: string) {
    const { rows } =
      await this.dataSource.query<PostgreSQLInformationSchemaColumn>(
        `SELECT table_schema, table_name, column_name, udt_name, is_nullable
       FROM information_schema.columns
       WHERE table_name = '${tableName}'`,
      )

    return rows.map((column) =>
      ColumnDefinition.fromPGInformationSchemaColumn(column).getInfo(),
    ) as ColumnDefinitionInfo[]
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

type Extension = {
  extname: string
  extversion: boolean
  description: string
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
  udt_name: string
  is_nullable: 'YES' | 'NO'
}

function genBase(
  extensions: Extension[],
  schemas: Schema[],
  tables: Table[],
  columns: Column[],
) {
  return [
    {
      key: '__schemas__',
      name: 'schemas',
      type: DSTreeItemType.Collection,
      for: DSTreeItemType.Schema,
      children: genSchemas(schemas, tables, columns),
    },
    {
      key: `__extensions__`,
      name: 'extensions',
      type: DSTreeItemType.Collection,
      for: DSTreeItemType.Extension,
      children: genExtensions(extensions),
    },
  ] as DSTreeCollectionItem[]
}

function genExtensions(extensions: Extension[]): DSTreeExtensionItem[] {
  return extensions.map((extension) => ({
    key: `__extensions__-${extension.extname}`,
    name: extension.extname,
    type: DSTreeItemType.Extension,
    description: extension.description,
    loaded: true,
    installed: true,
  }))
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
      dataType: column.udt_name,
      isNullable: column.is_nullable === 'YES',
    }))
}
