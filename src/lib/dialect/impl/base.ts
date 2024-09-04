import type { DSTreeItem } from '@/lib/dialect/interface'
import type { DataSource } from '@/lib/dataSources/impl/base'
import { ColumnDefinition } from '@/lib/schema/columns/definition/base'
import type { DatabaseEngine } from '@/lib/engines/enums'
import {
  type PartialTableIdentifier,
  TableDefinition,
  type TableIdentifier,
} from '@/lib/schema/tables/table'

export abstract class SqlDialect {
  protected dataSource: DataSource

  constructor(dataSource: DataSource) {
    this.dataSource = dataSource
  }

  get engine(): DatabaseEngine {
    return this.dataSource.engine
  }

  abstract getDataSourceTree(): Promise<DSTreeItem[]>

  /***
   * Gets a list of identifiers for all tables that match the provided criteria.
   */
  getTableIdentifiers(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    identifier: PartialTableIdentifier,
  ): Promise<TableIdentifier[]> {
    return Promise.resolve([])
  }

  /***
   * Gets a list of table names that match the provided criteria.
   */
  async getTableNames(identifier: PartialTableIdentifier): Promise<string[]> {
    return this.getTableIdentifiers(identifier).then((identifiers) =>
      identifiers.map((identifier) => identifier.name),
    )
  }

  /***
   * Gets a list of identifiers for all tables that are in the default schema.
   */
  getPublicTableIdentifiers(): Promise<TableIdentifier[]> {
    return Promise.resolve([])
  }

  /***
   * Gets a list of table names that are in the default schema.
   */
  async getPublicTableNames(): Promise<string[]> {
    return this.getPublicTableIdentifiers().then((identifiers) =>
      identifiers.map((identifier) => identifier.name),
    )
  }

  getTableColumnDefinitions(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    identifier: PartialTableIdentifier,
  ): Promise<ColumnDefinition[]> {
    return Promise.resolve([])
  }

  getTableDefinition(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    identifier: PartialTableIdentifier,
  ): Promise<TableDefinition> {
    return Promise.resolve(TableDefinition.dummy as TableDefinition)
  }

  abstract beginTransaction(): Promise<void>
  abstract commitTransaction(): Promise<void>
  abstract rollbackTransaction(): Promise<void>

  mightYieldRows(sql: string): boolean {
    const trimmed = sql.trim().toUpperCase()
    return trimmed.startsWith('SELECT') || trimmed.startsWith('WITH')
  }

  #indentSql(sql: string): string {
    if (sql.includes('\n')) {
      const indented = sql
        .split('\n')
        .map((line) => `  ${line}`)
        .join('\n')
      return `\n${indented}\n`
    } else {
      return sql
    }
  }

  makeSelectCountFromStatement(original: string): string {
    if (original.endsWith(';')) {
      throw new Error('original sql statement may not include semicolon.')
    }
    return `SELECT count(*) as count FROM (${this.#indentSql(original)})`
  }

  makePaginatedStatement(
    original: string,
    offset: number,
    limit: number,
  ): string {
    const trimmed = original.trim().toUpperCase()
    if (trimmed.endsWith(';')) {
      throw new Error('original sql statement may not include semicolon.')
    }
    if (limit === Infinity) {
      return original
    }
    return `SELECT * FROM (${this.#indentSql(original)}) LIMIT ${limit} OFFSET ${offset}`
  }
}
