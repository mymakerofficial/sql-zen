import type { DSTreeItem } from '@/lib/dialect/interface'
import type { DataSource } from '@/lib/dataSources/impl/base'
import type { ColumnDefinitionInfo } from '@/lib/schema/columns/definition/base'
import type { DatabaseEngine } from '@/lib/engines/enums'
import {
  type PartialTableIdentifier,
  TableDefinition,
  type TableInfo,
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

  getPublicTableNames(): Promise<string[]> {
    return Promise.resolve([])
  }

  getTableColumns(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    identifier: PartialTableIdentifier,
  ): Promise<ColumnDefinitionInfo[]> {
    return Promise.resolve([])
  }

  getTableDefinition(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    identifier: PartialTableIdentifier,
  ): Promise<TableInfo> {
    return Promise.resolve(TableDefinition.dummy.getUntypedInfo())
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
