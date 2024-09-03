import type { Runner } from '@/lib/runner/impl/runner'
import { RunnerEvent } from '@/lib/runner/events'
import { useSeline } from '@/composables/seline/seline'

const { track } = useSeline()

export function runnerAnalytics(runner: Runner) {
  // runner.on(RunnerEvent.BatchStarted, (batchSize) => {
  //   track('runner: batch started', { batchSize })
  // })

  runner.on(RunnerEvent.BatchCompleted, (queries) => {
    track('queries: batch completed', {
      queries: queries.map((it) => ({
        state: it.state,
        hasResultRows: it.hasResultRows,
      })),
    })
  })
}
