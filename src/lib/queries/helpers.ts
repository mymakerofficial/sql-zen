import type {
  PaginatedQueryResult,
  QueryInfo,
  QueryResult,
} from '@/lib/queries/interface'
import { QueryState } from '@/lib/queries/enums'

export function isIdleQuery(query: QueryInfo) {
  return query.state === QueryState.Idle
}

export function isExecutingQuery(query: QueryInfo) {
  return query.state === QueryState.Executing
}

export function isSuccessQuery(query: QueryInfo) {
  return query.state === QueryState.Success
}

export function isErrorQuery(query: QueryInfo) {
  return query.state === QueryState.Error
}

export function isCancelledQuery(query: QueryInfo) {
  return query.state === QueryState.Cancelled
}

export function isSettledQuery(query: QueryInfo) {
  return isSuccessQuery(query) || isErrorQuery(query) || isCancelledQuery(query)
}

export function hasResultRows(query: QueryInfo) {
  return query.hasResultRows
}

export function isPaginatedQueryResult<T extends object>(
  result?: QueryResult<T> | PaginatedQueryResult<T> | null,
): result is PaginatedQueryResult<T> {
  if (!result) return false
  return 'limit' in result && 'offset' in result
}
