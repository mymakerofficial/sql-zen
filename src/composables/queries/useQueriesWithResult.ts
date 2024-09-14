import { type MaybeRefOrGetter, toValue, watchEffect } from 'vue'
import { useRegistry } from '@/composables/useRegistry'
import { useExternalStore } from '@/composables/useExternalStore'
import { EventType } from '@/lib/events/publisher'
import type { QueryInfo } from '@/lib/queries/interface'

export function useQueriesWithResult(dataSourceKey: MaybeRefOrGetter<string>) {
  const registry = useRegistry()
  const [queries, setQueries] = useExternalStore<QueryInfo[]>([])

  watchEffect((onCleanup) => {
    const runner = registry.getRunner(toValue(dataSourceKey))

    function handle() {
      setQueries(runner.getQueries().filter((it) => it.hasResult))
    }
    handle()

    runner.on(EventType.Any, handle)

    onCleanup(() => {
      runner.off(EventType.Any, handle)
    })
  })

  return queries
}
