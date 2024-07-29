import { useEditorCursorPosition } from '@/composables/editor/useEditorCursorPosition'
import { computed } from 'vue'
import type { UseEditor } from '@/composables/editor/useEditor'

export function useSelectedStatement({ editor, statements }: UseEditor) {
  const position = useEditorCursorPosition(editor)
  return computed(() => {
    return (
      statements.value.find((statement) => {
        if (!position.value) {
          return false
        }
        const range = statement.range
        if (!range) {
          return false
        }
        if (range.startLineNumber === range.endLineNumber) {
          return (
            range.startLineNumber === position.value.lineNumber &&
            range.startColumn <= position.value.column &&
            // +1 to include the semicolon
            range.endColumn + 1 >= position.value.column
          )
        } else {
          if (range.startLineNumber === position.value.lineNumber) {
            return range.startColumn <= position.value.column
          }
          if (range.endLineNumber === position.value.lineNumber) {
            // +1 to include the semicolon
            return range.endColumn + 1 >= position.value.column
          }
          return (
            range.startLineNumber < position.value.lineNumber &&
            range.endLineNumber > position.value.lineNumber
          )
        }
      }) ?? null
    )
  })
}
