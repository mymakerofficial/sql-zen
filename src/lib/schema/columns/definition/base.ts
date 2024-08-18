import { DatabaseEngine } from '@/lib/engines/enums'
import {
  type DataTypeFromEngine,
  PseudoDataType,
  type WithPseudoTypes,
} from '@/lib/schema/columns/types/base'

export type ColumnDefinitionInfo<T extends DatabaseEngine = DatabaseEngine> = {
  engine: T
  name: string
  dataType: WithPseudoTypes<DataTypeFromEngine<T>>
  nullable: boolean
  primary: boolean
  unique: boolean
}

export class ColumnDefinition<T extends DatabaseEngine = DatabaseEngine>
  implements ColumnDefinitionInfo<T>
{
  readonly #engine: T
  readonly #name: string
  readonly #dataType: WithPseudoTypes<DataTypeFromEngine<T>>
  readonly #nullable: boolean
  readonly #primary: boolean
  readonly #unique: boolean

  constructor(info: ColumnDefinitionInfo<T>) {
    this.#engine = info.engine
    this.#name = info.name
    this.#dataType = info.dataType
    this.#nullable = info.nullable
    this.#primary = info.primary
    this.#unique = info.unique
  }

  static fromUnknown(name: string) {
    return new ColumnDefinition({
      engine: DatabaseEngine.None,
      name,
      dataType: PseudoDataType.Unknown,
      nullable: false,
      primary: false,
      unique: false,
    })
  }

  get engine() {
    return this.#engine
  }

  get name() {
    return this.#name
  }

  get dataType() {
    return this.#dataType
  }

  get nullable() {
    return this.#nullable
  }

  get primary() {
    return this.#primary
  }

  get unique() {
    return this.#unique
  }

  getInfo(): ColumnDefinitionInfo<T> {
    return {
      engine: this.#engine,
      name: this.#name,
      dataType: this.#dataType,
      nullable: this.#nullable,
      primary: this.#primary,
      unique: this.#unique,
    }
  }

  static from<T extends DatabaseEngine = typeof DatabaseEngine.None>(
    info: ColumnDefinitionInfo<T>,
  ) {
    return new ColumnDefinition(info)
  }
}
