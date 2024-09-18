import { DatabaseEngine } from '@/lib/engines/enums'
import {
  ColumnDefinition,
  type ColumnDefinitionInfo,
} from '@/lib/schema/columns/column'

export type TableIdentifier = {
  databaseName: string
  schemaName: string
  name: string
}

export type TableIdentifierCriterion = Partial<
  TableIdentifier & {
    includeSystemTables: boolean
  }
>

export type TableDefinitionInfo = TableIdentifier & {
  engine: DatabaseEngine
  columns: ColumnDefinitionInfo[]
}

export class TableDefinition implements TableDefinitionInfo {
  static #dummy = TableDefinition.fromEngineAndIdentifier(DatabaseEngine.None, {
    name: '',
  })

  #engine: DatabaseEngine
  #databaseName: string
  #schemaName: string
  #name: string
  #columns: ColumnDefinition[]

  constructor(info: TableDefinitionInfo) {
    this.#engine = info.engine
    this.#databaseName = info.databaseName
    this.#schemaName = info.schemaName
    this.#name = info.name
    this.#columns = info.columns.map((column) => ColumnDefinition.from(column))
  }

  static get dummy() {
    return this.#dummy
  }

  static from(info: TableDefinitionInfo) {
    return new TableDefinition(info)
  }

  static fromEngineAndIdentifier(
    engine: DatabaseEngine,
    identifier: TableIdentifierCriterion,
  ) {
    const { databaseName = '', schemaName = '', name = '' } = identifier
    return this.from({
      engine,
      databaseName,
      schemaName,
      name,
      columns: [],
    })
  }

  withColumns(columns: ColumnDefinitionInfo[]) {
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

  getInfo(): TableDefinitionInfo {
    return {
      engine: this.engine,
      databaseName: this.databaseName,
      schemaName: this.schemaName,
      name: this.name,
      columns: this.columns.map((column) => column.getInfo()),
    }
  }
}
