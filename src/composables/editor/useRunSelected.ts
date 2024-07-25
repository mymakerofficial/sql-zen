import type { UseEditor } from '@/composables/editor/useEditor'
import { computed } from 'vue'
import { useSelectedStatement } from '@/composables/editor/useSelectedStatement'

export function useRunSelected(editor: UseEditor) {
  if (!editor.runner) {
    throw new Error('Runner is required for runSelectedPlugin')
  }

  const statement = useSelectedStatement(editor)

  function runSelected() {
    if (!statement.value) {
      return
    }

    editor.runner!.run([statement.value])
  }

  const canRunSelected = computed(() => !!statement.value)

  return { runSelected, canRunSelected }
}
