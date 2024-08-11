import type {
  DSTreeDatabaseItem,
  DSTreeColumnItem,
  DSTreeSchemaItem,
  DSTreeTableItem,
  DSTreeCollectionItem,
  DSTreeViewItem,
  DSTreeFunctionItem,
  DSTreeExtensionItem,
} from '@/lib/dialect/interface'
import { DSTreeItemType } from '@/lib/dialect/enums'
import { SqlDialect } from '@/lib/dialect/impl/base'

export class DuckDBDialect extends SqlDialect {
  async getDataSourceTree() {
    const { rows: extensions } = await this.dataSource.query<Extension>(
      `SELECT extension_name, loaded, installed, description FROM duckdb_extensions()`,
    )

    const { rows: databases } = await this.dataSource.query<Database>(
      `SELECT database_name, path FROM duckdb_databases()`,
    )

    const { rows: schemas } = await this.dataSource.query<Schema>(
      `SELECT database_name, schema_name FROM duckdb_schemas()`,
    )

    const { rows: tables } = await this.dataSource.query<Table>(
      `SELECT database_name, schema_name, table_name FROM duckdb_tables()`,
    )

    const { rows: views } = await this.dataSource.query<View>(
      `SELECT database_name, schema_name, view_name FROM duckdb_views()`,
    )

    const { rows: functions } = await this.dataSource.query<Function>(
      `SELECT database_name, schema_name, function_name, description FROM duckdb_functions()`,
    )

    const { rows: columns } = await this.dataSource.query<Column>(
      `SELECT database_name, schema_name, table_name, column_name, data_type, is_nullable FROM duckdb_columns()`,
    )

    return genBase(
      extensions,
      databases,
      schemas,
      tables,
      views,
      functions,
      columns,
    )
  }

  async beginTransaction(): Promise<void> {
    await this.dataSource.query(`BEGIN TRANSACTION`)
  }

  async commitTransaction(): Promise<void> {
    await this.dataSource.query(`COMMIT`)
  }

  async rollbackTransaction(): Promise<void> {
    await this.dataSource.query(`ROLLBACK`)
  }
}

type Extension = {
  extension_name: string
  loaded: boolean
  installed: boolean
  description: string
}

type Database = {
  database_name: string
  path: string
}

type Schema = {
  database_name: string
  schema_name: string
}

type Table = {
  database_name: string
  schema_name: string
  table_name: string
}

type View = {
  database_name: string
  schema_name: string
  view_name: string
}

type Function = {
  database_name: string
  schema_name: string
  function_name: string
  description: string
}

type Column = {
  database_name: string
  schema_name: string
  table_name: string
  column_name: string
  data_type: string
  is_nullable: 'YES' | 'NO'
}

function genBase(
  extensions: Extension[],
  databases: Database[],
  schemas: Schema[],
  tables: Table[],
  views: View[],
  functions: Function[],
  columns: Column[],
) {
  return [
    ...genDatabases(databases, schemas, tables, views, functions, columns),
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
    key: `__extensions__-${extension.extension_name}`,
    name: extension.extension_name,
    type: DSTreeItemType.Extension,
    description: extension.description,
    loaded: extension.loaded,
    installed: extension.installed,
  }))
}

function genDatabases(
  databases: Database[],
  schemas: Schema[],
  tables: Table[],
  views: View[],
  functions: Function[],
  columns: Column[],
): DSTreeDatabaseItem[] {
  return databases.map((database) => ({
    key: `${database.database_name}`,
    name: database.database_name,
    type: DSTreeItemType.Database,
    path: database.path,
    children: [
      {
        key: '__schemas__',
        name: 'schemas',
        type: DSTreeItemType.Collection,
        for: DSTreeItemType.Schema,
        children: genSchemas(
          database.database_name,
          schemas,
          tables,
          views,
          functions,
          columns,
        ),
      },
    ],
  }))
}

function genSchemas(
  database: string,
  schemas: Schema[],
  tables: Table[],
  views: View[],
  functions: Function[],
  columns: Column[],
): DSTreeSchemaItem[] {
  return schemas
    .filter((it) => it.database_name === database)
    .map((schema) => ({
      key: `${database}-${schema.schema_name}`,
      name: schema.schema_name,
      type: DSTreeItemType.Schema,
      children: [
        {
          key: `${database}-${schema.schema_name}-__tables__`,
          name: 'tables',
          type: DSTreeItemType.Collection,
          for: DSTreeItemType.Table,
          children: genTables(database, schema.schema_name, tables, columns),
        },
        {
          key: `${database}-${schema.schema_name}-__views__`,
          name: 'views',
          type: DSTreeItemType.Collection,
          for: DSTreeItemType.View,
          children: genViews(database, schema.schema_name, views, columns),
        },
        {
          key: `${database}-${schema.schema_name}-__functions__`,
          name: 'functions',
          type: DSTreeItemType.Collection,
          for: DSTreeItemType.Function,
          children: genFunctions(database, schema.schema_name, functions),
        },
      ] as DSTreeCollectionItem[],
    }))
}

function genTables(
  database: string,
  schema: string,
  tables: Table[],
  columns: Column[],
): DSTreeTableItem[] {
  return tables
    .filter((it) => it.database_name === database && it.schema_name === schema)
    .map((table) => ({
      key: `${database}-${schema}-${table.table_name}`,
      name: table.table_name,
      type: DSTreeItemType.Table,
      children: [
        {
          key: `${database}-${schema}-${table.table_name}-__columns__`,
          name: 'columns',
          type: DSTreeItemType.Collection,
          for: DSTreeItemType.Column,
          children: genColumns(database, schema, table.table_name, columns),
        },
      ],
    }))
}

function genViews(
  database: string,
  schema: string,
  views: View[],
  columns: Column[],
): DSTreeViewItem[] {
  return views
    .filter((it) => it.database_name === database && it.schema_name === schema)
    .map((view) => ({
      key: `${database}-${schema}-${view.view_name}`,
      name: view.view_name,
      type: DSTreeItemType.View,
      children: [
        {
          key: `${database}-${schema}-${view.view_name}-__columns__`,
          name: 'columns',
          type: DSTreeItemType.Collection,
          for: DSTreeItemType.Column,
          children: genColumns(database, schema, view.view_name, columns),
        },
      ],
    }))
}

function genColumns(
  database: string,
  schema: string,
  table: string,
  columns: Column[],
): DSTreeColumnItem[] {
  return columns
    .filter(
      (it) =>
        it.database_name === database &&
        it.schema_name === schema &&
        it.table_name === table,
    )
    .map((column) => ({
      key: `${database}-${schema}-${table}-${column.column_name}`,
      name: column.column_name,
      type: DSTreeItemType.Column,
      dataType: column.data_type,
      isNullable: column.is_nullable === 'YES',
    }))
}

function genFunctions(
  database: string,
  schema: string,
  functions: Function[],
): DSTreeFunctionItem[] {
  return functions
    .filter((it) => it.database_name === database && it.schema_name === schema)
    .map((func) => ({
      key: `${database}-${schema}-${func.function_name}`,
      name: func.function_name,
      type: DSTreeItemType.Function,
      description: func.description,
    }))
}
