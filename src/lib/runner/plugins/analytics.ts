import type { Runner } from '@/lib/runner/impl/runner'
import { RunnerEvent } from '@/lib/runner/events'
import { useSeline } from '@/composables/seline/seline'
import {
  hasResultRows,
  isErrorQuery,
  isSuccessQuery,
} from '@/lib/queries/helpers'
import type { QueryInfo } from '@/lib/queries/interface'

const { track } = useSeline()

export function runnerAnalytics(runner: Runner) {
  function trackSingleQuery(query: QueryInfo) {
    const { state, hasResultRows } = query

    track('queries: single-completed', {
      ...runner.dataSource.getAnonymizedAnalyticsData(),
      state,
      hasResultRows,
    })
  }

  function trackBatchQuery(queries: QueryInfo[], transacting: boolean) {
    const queryCount = queries.length
    const successCount = queries.filter(isSuccessQuery).length
    const errorCount = queries.filter(isErrorQuery).length
    const hasResultRowsCount = queries.filter(hasResultRows).length

    track('queries: batch-completed', {
      ...runner.dataSource.getAnonymizedAnalyticsData(),
      queryCount,
      successCount,
      errorCount,
      hasResultRowsCount,
      transacting,
    })
  }

  runner.on(RunnerEvent.BatchCompleted, (queries, transacting) => {
    if (queries.length === 1) {
      trackSingleQuery(queries[0])
    } else {
      trackBatchQuery(queries, transacting)
    }
  })
}
