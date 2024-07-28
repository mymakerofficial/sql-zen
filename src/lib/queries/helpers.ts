import type {
  CancelledQuery,
  ErrorQuery,
  IdleQuery,
  Query,
  RunningQuery,
  SuccessQuery,
} from '@/lib/queries/interface'
import { QueryState } from '@/lib/queries/enums'

export function isIdleQuery(query: Query): query is IdleQuery {
  return query.state === QueryState.Idle
}

export function isExecutingQuery(query: Query): query is RunningQuery {
  return query.state === QueryState.Executing
}

export function isSuccessQuery(query: Query): query is SuccessQuery {
  return query.state === QueryState.Success
}

export function isErrorQuery(query: Query): query is ErrorQuery {
  return query.state === QueryState.Error
}

export function isCancelledQuery(query: Query): query is CancelledQuery {
  return query.state === QueryState.Cancelled
}

export function isSettledQuery(
  query: Query,
): query is SuccessQuery | ErrorQuery | CancelledQuery {
  return isSuccessQuery(query) || isErrorQuery(query) || isCancelledQuery(query)
}
