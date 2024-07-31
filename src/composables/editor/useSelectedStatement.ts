import {
  useEditorCursorSelection,
  useEditorSelectionStart,
} from '@/composables/editor/useEditorCursorPosition'
import { computed } from 'vue'
import type { UseEditor } from '@/composables/editor/useEditor'
import {
  positionInsideRange,
  rangeIsAfterPosition,
  rangesTouch,
} from '@/lib/statements/rangeHelpers'

export function useSelectedStatement({ editor, statements }: UseEditor) {
  const position = useEditorSelectionStart(editor)
  return computed(() => {
    if (!position.value) {
      return null
    }
    return (
      statements.value
        .filter((it) => it.range)
        .find((it) => positionInsideRange(position.value!, it.range!)) ?? null
    )
  })
}

export function useStatementsInSelection({ editor, statements }: UseEditor) {
  const selection = useEditorCursorSelection(editor)
  return computed(() => {
    if (!selection.value) {
      return []
    }
    return statements.value
      .filter((it) => it.range)
      .filter((it) => rangesTouch(selection.value!, it.range!))
  })
}

export function useStatementsAfterSelected({ editor, statements }: UseEditor) {
  const position = useEditorSelectionStart(editor)
  return computed(() => {
    if (!position.value) {
      return []
    }
    return statements.value
      .filter((it) => it.range)
      .filter((it) => rangeIsAfterPosition(it.range!, position.value!))
  })
}
