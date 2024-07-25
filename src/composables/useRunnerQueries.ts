import { onMounted, onUnmounted, ref } from 'vue'
import type { Query, Runner } from '@/lib/runner/runner'
import { EventType } from '@/lib/events/publisher'

export function useRunnerQueries(runner: Runner) {
  const queries = ref<Array<Query>>([])

  update()

  function update() {
    // we need to create a new array to trigger reactivity
    queries.value = [...runner.getQueries()]
  }

  onMounted(() => {
    runner.on(EventType.Any, () => update())
  })

  onUnmounted(() => {
    runner.off(EventType.Any, () => update())
  })

  return queries
}
