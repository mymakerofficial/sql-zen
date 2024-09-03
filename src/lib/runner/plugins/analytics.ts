import type { Runner } from '@/lib/runner/impl/runner'
import { RunnerEvent } from '@/lib/runner/events'
import { useSeline } from '@/composables/seline/seline'
import {
  hasResultRows,
  isErrorQuery,
  isSuccessQuery,
} from '@/lib/queries/helpers'

const { track } = useSeline()

export function runnerAnalytics(runner: Runner) {
  // runner.on(RunnerEvent.BatchStarted, (batchSize) => {
  //   track('runner: batch-started', { batchSize })
  // })

  runner.on(RunnerEvent.BatchCompleted, (queries, transacting) => {
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
  })
}
