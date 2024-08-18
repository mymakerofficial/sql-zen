import { EventPublisher } from '@/lib/events/publisher'
import { type QueryEventMap } from '@/lib/queries/events'
import type {
  PaginatedQueryResult,
  QueryInfo,
  QueryResult,
  QueryTotalRowCount,
} from '@/lib/queries/interface'
import type { Statement } from '@/lib/statements/interface'
import { QueryState } from '@/lib/queries/enums'
import type { Query } from '@/lib/queries/impl/query'

export abstract class QueryBase<T extends object = object>
  extends EventPublisher<QueryEventMap>
  implements QueryInfo
{
  protected constructor() {
    super()
  }

  static get null() {
    return new NullQuery() as Query
  }

  abstract getId(): string

  get id() {
    return this.getId()
  }

  abstract getState(): QueryState

  get state() {
    return this.getState()
  }

  abstract getStatement(): Statement

  get statement() {
    return this.getStatement()
  }

  abstract getHasResult(): boolean

  get hasResult() {
    return this.getHasResult()
  }

  abstract getHasResultRows(): boolean

  get hasResultRows() {
    return this.getHasResultRows()
  }

  getInfo(): QueryInfo {
    return {
      id: this.id,
      state: this.state,
      statement: this.statement,
      hasResult: this.hasResult,
      hasResultRows: this.hasResultRows,
    }
  }

  abstract getError(): Error | null

  abstract getResult(): QueryResult<T> | PaginatedQueryResult<T>

  abstract getTotalRowCount(): QueryTotalRowCount

  abstract computeTotalRowCount(): Promise<void>

  abstract execute(): Promise<void>

  abstract fetchRows(offset: number, limit: number): Promise<void>

  abstract cancel(): void
}

class NullQuery<T extends object = object> extends QueryBase<T> {
  constructor() {
    super()
  }

  getId() {
    return ''
  }

  getState() {
    return QueryState.Idle
  }

  getHasResult() {
    return false
  }

  getHasResultRows() {
    return false
  }

  cancel(): void {}

  async computeTotalRowCount(): Promise<void> {
    return
  }

  async execute(): Promise<void> {
    return
  }

  async fetchRows(_offset: number, _limit: number): Promise<void> {
    return
  }

  getError(): Error | null {
    return null
  }

  getResult(): QueryResult<T> | PaginatedQueryResult<T> {
    return { columns: [], rows: [], affectedRows: null, duration: 0, id: '' }
  }

  getStatement(): Statement {
    return { sql: '', key: '' }
  }

  getTotalRowCount(): QueryTotalRowCount {
    return { min: 0, isKnown: false }
  }
}
