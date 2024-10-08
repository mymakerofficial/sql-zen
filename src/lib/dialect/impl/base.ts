import type { DSTreeItem } from '@/lib/dialect/interface'
import type { DataSource } from '@/lib/dataSources/impl/base'
import { ColumnDefinition } from '@/lib/schema/columns/column'
import type { DatabaseEngine } from '@/lib/engines/enums'
import {
  type TableIdentifierCriterion,
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
    identifier?: TableIdentifierCriterion,
  ): Promise<TableIdentifier[]> {
    return Promise.resolve([])
  }

  /***
   * Gets a list of table names that match the provided criteria.
   */
  async getTableNames(
    identifier?: TableIdentifierCriterion,
  ): Promise<string[]> {
    return this.getTableIdentifiers(identifier).then((identifiers) =>
      identifiers.map((identifier) => identifier.name),
    )
  }

  getTableColumnDefinitions(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    identifier?: TableIdentifierCriterion,
  ): Promise<ColumnDefinition[]> {
    return Promise.resolve([])
  }

  getTableDefinition(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    identifier?: TableIdentifierCriterion,
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

  #trimSql(sql: string): string {
    return sql.trimStart().replace(/\s+;?$/g, '')
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
    return `SELECT count(*) AS count FROM (${this.#indentSql(this.#trimSql(original))}) AS __INTERNAL_user_src__`
  }

  makePaginatedStatement(
    original: string,
    offset: number,
    limit: number,
  ): string {
    if (limit === Infinity) {
      return original
    }
    return `SELECT * FROM (${this.#indentSql(this.#trimSql(original))}) AS __INTERNAL_user_src__ LIMIT ${limit} OFFSET ${offset}`
  }
}
