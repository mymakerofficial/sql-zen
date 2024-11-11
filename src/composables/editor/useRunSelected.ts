import type { UseEditor } from '@/composables/editor/useEditor'
import { computed } from 'vue'
import { useSelectedStatement } from '@/composables/editor/useSelectedStatement'
import { useIsRunning } from '@/composables/useIsRunning'

export function useRunSelected(editor: UseEditor) {
  if (!editor.runner) {
    throw new Error('Runner is required for runSelectedPlugin')
  }

  const statement = useSelectedStatement(editor)
  const isRunning = useIsRunning(editor.runner.getId())

  function runSelected() {
    if (!statement.value) {
      return
    }

    editor.runner!.batch([statement.value])
  }

  const canRunSelected = computed(() => !!statement.value && isRunning.value)

  return { runSelected, canRunSelected }
}
