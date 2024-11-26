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
  type PostgreSQLInformationSchemaColumn,
} from '@/lib/schema/columns/column'
import {
  type TableIdentifierCriterion,
  TableDefinition,
  type TableIdentifier,
} from '@/lib/schema/tables/table'

export class PostgreSQLDialect extends SqlDialect {
  async getDataSourceTree() {
    const { rows: extensions } = await this.dataSource.query<Extension>(
      `SELECT 
    e.extname, 
    e.extversion, 
    d.description 
FROM pg_catalog.pg_extension AS e 
LEFT JOIN pg_catalog.pg_description AS d 
ON e.oid = d.objoid`,
    )

    const { rows: schemas } = await this.dataSource.query<Schema>(
      `SELECT nspname, oid 
FROM pg_catalog.pg_namespace 
ORDER BY oid DESC`,
    )

    const { rows: tables } = await this.dataSource.query<Table>(
      `SELECT table_schema, table_name 
FROM information_schema.tables 
WHERE table_type = 'BASE TABLE'`,
    )

    const { rows: views } = await this.dataSource.query<View>(
      `SELECT table_schema, table_name 
FROM information_schema.views`,
    )

    const { rows: columns } = await this.dataSource.query<Column>(
      `SELECT table_schema, table_name, column_name, udt_name, is_nullable 
FROM information_schema.columns`,
    )

    return genBase(extensions, schemas, tables, views, columns)
  }

  #queryFiltersFromIdentifier(
    identifier: TableIdentifierCriterion = {},
    columnNames: {
      [K in keyof TableIdentifier]: string
    } = {
      databaseName: 'table_catalog',
      schemaName: 'table_schema',
      name: 'table_name',
    },
  ) {
    const parts = []

    if (identifier.databaseName) {
      parts.push(`${columnNames.databaseName} = '${identifier.databaseName}'`)
    } else {
      parts.push(`${columnNames.databaseName} = current_database()`)
    }

    if (identifier.schemaName) {
      parts.push(`${columnNames.schemaName} = '${identifier.schemaName}'`)
    } else if (!identifier.includeSystemTables) {
      parts.push(
        `${columnNames.schemaName} NOT IN ('pg_catalog', 'pg_toast', 'information_schema')`,
      )
    }

    if (identifier.name) {
      parts.push(`${columnNames.name} = '${identifier.name}'`)
    }

    return parts.join('\n    AND ')
  }

  async getTableIdentifiers(identifier: TableIdentifierCriterion = {}) {
    const filters = this.#queryFiltersFromIdentifier(identifier)

    const { rows } = await this.dataSource.query<{
      table_catalog: string
      table_schema: string
      table_name: string
    }>(
      `SELECT
    table_catalog,
    table_schema,
    table_name
FROM information_schema.tables
WHERE ${filters}`,
    )

    return rows.map((it) => ({
      databaseName: it.table_catalog,
      schemaName: it.table_schema,
      name: it.table_name,
    }))
  }

  async getTableColumnDefinitions(identifier: TableIdentifierCriterion) {
    if (!identifier.name) {
      // no table name is specified
      //  querying the database would result in meaningless data
      //  so just return an empty array
      return []
    }

    const filters = this.#queryFiltersFromIdentifier(identifier)

    const { rows } =
      await this.dataSource.query<PostgreSQLInformationSchemaColumn>(
        `SELECT 
    table_catalog,
    table_schema, 
    table_name, 
    column_name,
    udt_name, 
    is_nullable
FROM information_schema.columns
WHERE ${filters}`,
      )

    return rows.map((column) =>
      ColumnDefinition.fromPGInformationSchemaColumn(column),
    ) as ColumnDefinition[]
  }

  async getTableDefinition(identifier: TableIdentifierCriterion = {}) {
    const columns = await this.getTableColumnDefinitions(identifier)

    return TableDefinition.fromEngineAndIdentifier(
      this.engine,
      identifier,
    ).withColumns(columns)
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
  table_schema: string
  table_name: string
}

type View = {
  table_schema: string
  table_name: string
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
  views: View[],
  columns: Column[],
) {
  return [
    {
      key: '__schemas__',
      name: 'schemas',
      type: DSTreeItemType.Collection,
      for: DSTreeItemType.Schema,
      children: genSchemas(schemas, tables, views, columns),
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
  views: View[],
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
      {
        key: `${schema.nspname}__views__`,
        name: 'views',
        type: DSTreeItemType.Collection,
        for: DSTreeItemType.Table,
        children: genViews(schema.nspname, views, columns),
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
    .filter((it) => it.table_schema === schema)
    .map((table) => ({
      key: `${schema}-${table.table_name}`,
      name: table.table_name,
      type: DSTreeItemType.Table,
      children: genColumns(schema, table.table_name, columns),
    }))
}

function genViews(
  schema: string,
  views: View[],
  columns: Column[],
): DSTreeTableItem[] {
  return views
    .filter((it) => it.table_schema === schema)
    .map((table) => ({
      key: `${schema}-${table.table_name}`,
      name: table.table_name,
      type: DSTreeItemType.Table,
      children: genColumns(schema, table.table_name, columns),
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
      isPrimaryKey: false,
    }))
}
