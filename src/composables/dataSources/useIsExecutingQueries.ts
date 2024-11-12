import { type MaybeRefOrGetter, toValue, watchEffect } from 'vue'
import { useExternalStore } from '@/composables/useExternalStore'
import { useRegistry } from '@/composables/useRegistry'
import { QueryState } from '@/lib/queries/enums'
import { RunnerEvent } from '@/lib/runner/events'

export function useIsExecutingQueries(dataSourceId: MaybeRefOrGetter<string>) {
  const registry = useRegistry()
  const [isRunningQueries, setIsExecutingQueries] = useExternalStore(false)

  watchEffect((onCleanup) => {
    const runner = registry.getRunner(toValue(dataSourceId))

    function handle() {
      const newValue = runner
        .getQueries()
        .some((it) => it.state === QueryState.Executing)
      // prevent unnecessary updates
      if (isRunningQueries.value === newValue) {
        return
      }
      setIsExecutingQueries(newValue)
    }
    handle()

    runner.on(RunnerEvent.QueriesUpdated, handle)

    onCleanup(() => {
      runner.off(RunnerEvent.QueriesUpdated, handle)
    })
  })

  return isRunningQueries
}
