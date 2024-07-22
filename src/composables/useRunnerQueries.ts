import { onMounted, onUnmounted, ref } from 'vue'
import type { Query, Runner } from '@/lib/runner/runner'

export function useRunnerQueries(runner: Runner) {
  const queries = ref<Array<Query>>([])

  update()

  function update() {
    // we need to create a new array to trigger reactivity
    queries.value = [...runner.getQueries()]
  }

  onMounted(() => {
    runner.on(() => update())
  })

  onUnmounted(() => {
    runner.off(() => update())
  })

  return queries
}
