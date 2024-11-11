import type { UseEditor } from '@/composables/editor/useEditor'
import { useIsRunning } from '@/composables/useIsRunning'
import { computed } from 'vue'

export function useRunAll({ statements, runner }: UseEditor) {
  if (!runner) {
    throw new Error('Runner is required for useRunAll')
  }

  const isRunning = useIsRunning(runner.getId())
  const canRunAll = computed(
    () => statements.value.length > 0 && isRunning.value,
  )

  function runAll() {
    runner!.batch(statements.value)
  }

  return { runAll, canRunAll }
}
