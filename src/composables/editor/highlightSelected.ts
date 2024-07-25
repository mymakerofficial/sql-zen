import type { UseEditor } from '@/composables/editor/useEditor'
import { useSelectedStatement } from '@/composables/editor/useSelectedStatement'
import type * as monaco from 'monaco-editor'
import { watchEffect } from 'vue'

export default function highlightSelectedPlugin(editor: UseEditor) {
  const statement = useSelectedStatement(editor)

  let decorations: monaco.editor.IEditorDecorationsCollection | null = null

  function clear() {
    if (decorations) {
      decorations.clear()
      decorations = null
    }
  }

  function highlight() {
    if (!statement.value) {
      return
    }
    decorations = editor.editor.createDecorationsCollection([
      {
        range: statement.value,
        options: {
          className: 'selected-statement',
        },
      },
    ])
  }

  watchEffect(() => {
    clear()
    highlight()
  })
}
