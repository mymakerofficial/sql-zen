import {
  type SchemaTreeCatalogItem,
  type SchemaTreeColumnItem,
  SchemaTreeItemType,
  type SchemaTreeSchemaItem,
  type SchemaTreeTableItem,
  type SchemaTreeTablesItem,
  SqlDialect,
} from '@/lib/dialect/dialect'

export class DuckDBDialect extends SqlDialect {
  async getSchemaTree() {
    const catalogs = await this.dataSource.query<Catalog>(
      `SELECT DISTINCT catalog_name FROM information_schema.schemata`,
    )

    const schemas = await this.dataSource.query<Schema>(
      `SELECT catalog_name, schema_name, schema_owner FROM information_schema.schemata`,
    )

    const tables = await this.dataSource.query<Table>(
      `SELECT table_catalog, table_schema, table_name, table_type FROM information_schema.tables`,
    )

    const columns = await this.dataSource.query<Column>(
      `SELECT table_catalog, table_schema, table_name, column_name, data_type, is_nullable FROM information_schema.columns`,
    )

    return genCatalogs(catalogs, schemas, tables, columns)
  }
}

type Catalog = {
  catalog_name: string
}

type Schema = {
  catalog_name: string
  schema_name: string
  schema_owner: string
}

type Table = {
  table_catalog: string
  table_schema: string
  table_name: string
  table_type: string
}

type Column = {
  table_catalog: string
  table_schema: string
  table_name: string
  column_name: string
  data_type: string
  is_nullable: 'YES' | 'NO'
}

function genCatalogs(
  catalogs: Catalog[],
  schemas: Schema[],
  tables: Table[],
  columns: Column[],
) {
  const tree: Array<SchemaTreeCatalogItem> = []

  catalogs.forEach((catalog) => {
    const catalogItem: SchemaTreeCatalogItem = {
      name: catalog.catalog_name,
      type: SchemaTreeItemType.Catalog,
      children: genSchemas(catalog.catalog_name, schemas, tables, columns),
    }

    tree.push(catalogItem)
  })

  return tree
}

function genSchemas(
  catalog: string,
  schemas: Schema[],
  tables: Table[],
  columns: Column[],
) {
  const tree: Array<SchemaTreeSchemaItem> = []

  schemas
    .filter((it) => it.catalog_name === catalog)
    .forEach((schema) => {
      const schemaItem: SchemaTreeSchemaItem = {
        name: schema.schema_name,
        type: SchemaTreeItemType.Schema,
        children: [
          {
            name: 'tables',
            type: SchemaTreeItemType.Tables,
            children: genTables(catalog, schema.schema_name, tables, columns),
          },
        ] as unknown as SchemaTreeTablesItem[],
      }

      tree.push(schemaItem)
    })

  return tree
}

function genTables(
  catalog: string,
  schema: string,
  tables: Table[],
  columns: Column[],
) {
  const tree: Array<SchemaTreeTableItem> = []

  tables
    .filter((it) => it.table_catalog === catalog && it.table_schema === schema)
    .forEach((table) => {
      const tableItem: SchemaTreeTableItem = {
        name: table.table_name,
        type: SchemaTreeItemType.Table,
        children: genColumns(catalog, schema, table.table_name, columns),
      }

      tree.push(tableItem)
    })

  return tree
}

function genColumns(
  catalog: string,
  schema: string,
  table: string,
  columns: Column[],
) {
  const tree: Array<SchemaTreeColumnItem> = []

  columns
    .filter(
      (it) =>
        it.table_catalog === catalog &&
        it.table_schema === schema &&
        it.table_name === table,
    )
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
