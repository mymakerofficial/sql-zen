import { useEditorCursorPosition } from '@/composables/editor/useEditorCursorPosition'
import { computed } from 'vue'
import type { UseEditor } from '@/composables/editor/useEditor'

export function useSelectedStatement({ editor, statements }: UseEditor) {
  const position = useEditorCursorPosition(editor)
  return computed(() => {
    return (
      statements.value.find((s) => {
        if (!position.value) {
          return false
        }
        if (s.startLineNumber === s.endLineNumber) {
          return (
            s.startLineNumber === position.value.lineNumber &&
            s.startColumn <= position.value.column &&
            s.endColumn >= position.value.column
          )
        } else {
          if (s.startLineNumber === position.value.lineNumber) {
            return s.startColumn <= position.value.column
          }
          if (s.endLineNumber === position.value.lineNumber) {
            return s.endColumn >= position.value.column
          }
          return (
            s.startLineNumber < position.value.lineNumber &&
            s.endLineNumber > position.value.lineNumber
          )
        }
      }) ?? null
    )
  })
}
