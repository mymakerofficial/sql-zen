import { DatabaseEngine } from '@/lib/engines/enums'
import {
  ColumnDefinition,
  type ColumnDefinitionInfo,
} from '@/lib/schema/columns/definition/base'

export type TableIdentifier = {
  databaseName: string
  schemaName: string
  name: string
}

export type PartialTableIdentifier = Partial<TableIdentifier>

export type TableInfo<T extends DatabaseEngine = DatabaseEngine> =
  TableIdentifier & {
    engine: T
    columns: ColumnDefinitionInfo<T>[]
  }

export class TableDefinition<T extends DatabaseEngine = DatabaseEngine>
  implements TableInfo<T>
{
  static #dummy = TableDefinition.fromEngineAndIdentifier(DatabaseEngine.None, {
    name: '',
  })

  #engine: T
  #databaseName: string
  #schemaName: string
  #name: string
  #columns: ColumnDefinition<T>[]

  constructor(info: TableInfo<T>) {
    this.#engine = info.engine
    this.#databaseName = info.databaseName
    this.#schemaName = info.schemaName
    this.#name = info.name
    this.#columns = info.columns.map((column) => ColumnDefinition.from(column))
  }

  static get dummy() {
    return this.#dummy
  }

  static from<T extends DatabaseEngine = typeof DatabaseEngine.None>(
    info: TableInfo<T>,
  ) {
    return new TableDefinition(info)
  }

  static fromEngineAndIdentifier<
    T extends DatabaseEngine = typeof DatabaseEngine.None,
  >(engine: T, identifier: PartialTableIdentifier) {
    const { databaseName = '', schemaName = '', name = '' } = identifier
    return this.from({
      engine,
      databaseName,
      schemaName,
      name,
      columns: [],
    })
  }

  withColumns(columns: ColumnDefinitionInfo<T>[]) {
    return TableDefinition.from({
      ...this.getInfo(),
      columns,
    })
  }

  get engine() {
    return this.#engine
  }

  get databaseName() {
    return this.#databaseName
  }

  get schemaName() {
    return this.#schemaName
  }

  get name() {
    return this.#name
  }

  get columns() {
    return this.#columns
  }

  getInfo(): TableInfo<T> {
    return {
      engine: this.engine,
      databaseName: this.databaseName,
      schemaName: this.schemaName,
      name: this.name,
      columns: this.columns.map((column) => column.getInfo()),
    }
  }

  getUntypedInfo(): TableInfo {
    return this.getInfo() as unknown as TableInfo
  }
}
