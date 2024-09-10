import { Runner } from '@/lib/runner/impl/runner'
import { RunnerEvent } from '@/lib/runner/events'
import { useSeline } from '@/composables/seline/seline'
import {
  hasResultRows,
  isErrorQuery,
  isSuccessQuery,
} from '@/lib/queries/helpers'

const { track } = useSeline()

export const runnerAnalytics = Runner.definePlugin((runner) => {
  runner.on(RunnerEvent.BatchCompleted, (queries, transacting) => {
    const queryCount = queries.length
    const successCount = queries.filter(isSuccessQuery).length
    const errorCount = queries.filter(isErrorQuery).length
    const hasResultRowsCount = queries.filter(hasResultRows).length
    const hasCommentCount = queries.filter((query) => !!query.statement.comment).length

    track('queries: batch-completed', {
      ...runner.dataSource.getAnonymizedAnalyticsData(),
      queryCount,
      successCount,
      errorCount,
      hasResultRowsCount,
      hasCommentCount,
      transacting,
    })
  })
})
