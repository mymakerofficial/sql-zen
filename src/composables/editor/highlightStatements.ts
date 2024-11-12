import type { UseEditor } from '@/composables/editor/useEditor'
import type * as monaco from 'monaco-editor'
import { type MaybeRefOrGetter, onScopeDispose, watchEffect } from 'vue'
import type { Statement } from '@/lib/statements/interface'
import { toValue } from '@vueuse/core'

export default function highlightStatementsPlugin(
  statements: MaybeRefOrGetter<Array<Statement>>,
  options: monaco.editor.IModelDecorationOptions = {},
) {
  return (editor: UseEditor) => {
    let decorations: monaco.editor.IEditorDecorationsCollection | null = null

    function clear() {
      if (decorations) {
        decorations.clear()
        decorations = null
      }
    }

    function highlight() {
      decorations = editor.editor.createDecorationsCollection(
        toValue(statements).map((statement) => ({
          range: statement.range!,
          options: {
            className: 'selected-statement',
            ...options,
          },
        })),
      )
    }

    watchEffect(() => {
      clear()
      highlight()
    })

    onScopeDispose(() => {
      clear()
    })
  }
}
