import type {
  IQuery,
  PaginatedQueryResult,
  QueryResult,
} from '@/lib/queries/interface'
import { QueryState } from '@/lib/queries/enums'

export function isIdleQuery(query: IQuery) {
  return query.getState() === QueryState.Idle
}

export function isExecutingQuery(query: IQuery) {
  return query.getState() === QueryState.Executing
}

export function isSuccessQuery(query: IQuery) {
  return query.getState() === QueryState.Success
}

export function isErrorQuery(query: IQuery) {
  return query.getState() === QueryState.Error
}

export function isCancelledQuery(query: IQuery) {
  return query.getState() === QueryState.Cancelled
}

export function isSettledQuery(query: IQuery) {
  return isSuccessQuery(query) || isErrorQuery(query) || isCancelledQuery(query)
}

export function isPaginatedQueryResult<T extends object>(
  result?: QueryResult<T> | PaginatedQueryResult<T> | null,
): result is PaginatedQueryResult<T> {
  if (!result) return false
  return 'totalRows' in result
}
