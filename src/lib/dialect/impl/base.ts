import type { ISqlDialect, DSTreeItem } from '@/lib/dialect/interface'
import type { IDataSource } from '@/lib/dataSources/interface'

export abstract class SqlDialect implements ISqlDialect {
  protected dataSource: IDataSource

  constructor(dataSource: IDataSource) {
    this.dataSource = dataSource
  }

  abstract getDataSourceTree(): Promise<DSTreeItem[]>

  isSelect(sql: string): boolean {
    return sql.toLowerCase().startsWith('select')
  }

  #indentSql(sql: string): string {
    return sql
      .split('\n')
      .map((line) => `  ${line}`)
      .join('\n')
  }

  makeSelectCountFromStatement(original: string): string {
    if (original.endsWith(';')) {
      throw new Error('original sql statement may not include semicolon.')
    }
    return `SELECT count(*) as count FROM (\n${this.#indentSql(original)}\n)`
  }

  makePaginatedStatement(
    original: string,
    offset: number,
    limit: number,
  ): string {
    if (original.endsWith(';')) {
      throw new Error('original sql statement may not include semicolon.')
    }
    return `SELECT * FROM (\n${this.#indentSql(original)}\n) LIMIT ${limit} OFFSET ${offset}`
  }
}
