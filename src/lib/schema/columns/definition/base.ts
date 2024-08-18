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
  isNullable: boolean
  isPrimaryKey: boolean
  isUnique: boolean
}

export class ColumnDefinition<T extends DatabaseEngine = DatabaseEngine>
  implements ColumnDefinitionInfo<T>
{
  readonly #engine: T
  readonly #name: string
  readonly #dataType: WithPseudoTypes<DataTypeFromEngine<T>>
  readonly #isNullable: boolean
  readonly #isPrimaryKey: boolean
  readonly #isUnique: boolean

  constructor(info: ColumnDefinitionInfo<T>) {
    this.#engine = info.engine
    this.#name = info.name
    this.#dataType = info.dataType
    this.#isNullable = info.isNullable
    this.#isPrimaryKey = info.isPrimaryKey
    this.#isUnique = info.isUnique
  }

  static fromUnknown(name: string) {
    return new ColumnDefinition({
      engine: DatabaseEngine.None,
      name,
      dataType: PseudoDataType.Unknown,
      isNullable: false,
      isPrimaryKey: false,
      isUnique: false,
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

  get isNullable() {
    return this.#isNullable
  }

  get isPrimaryKey() {
    return this.#isPrimaryKey
  }

  get isUnique() {
    return this.#isUnique
  }

  getInfo(): ColumnDefinitionInfo<T> {
    return {
      engine: this.#engine,
      name: this.#name,
      dataType: this.#dataType,
      isNullable: this.#isNullable,
      isPrimaryKey: this.#isPrimaryKey,
      isUnique: this.#isUnique,
    }
  }

  static from<T extends DatabaseEngine = typeof DatabaseEngine.None>(
    info: ColumnDefinitionInfo<T>,
  ) {
    return new ColumnDefinition(info)
  }
}
