import type { Statement } from '@/lib/statements/interface'
import type { QueryState } from '@/lib/queries/enums'
import type { FieldInfo } from '@/lib/schema/columns/column'

// there is a difference between the QueryResult.id and Query.id
//  QueryResult.id is generated by the database when a statement is successfully executed
//  Query.id is generated by the application when the query is created

export type QueryResult<T extends object = object> = {
  fields: Array<FieldInfo>
  rows: Array<T>
  affectedRows: number | null
  duration: number
  systemDuration: number
  id: string
}

export type PaginatedQueryResult<T extends object = object> = QueryResult<T> & {
  offset: number
  limit: number
}

export type QueryInfo = {
  id: string
  state: QueryState
  statement: Statement
  hasResult: boolean
  hasResultRows: boolean
}

export type QueryTotalRowCount = {
  min: number
  isKnown: boolean
}
