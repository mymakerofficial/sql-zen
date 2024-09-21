import { computed, customRef } from 'vue'
import * as monaco from 'monaco-editor'

export function useEditorCursorSelection(
  editor: monaco.editor.IStandaloneCodeEditor,
) {
  return computed(
    () =>
      customRef((track, trigger) => {
        const value = editor.getSelection()

        editor.onDidChangeCursorSelection(() => {
          // selection is stored by reference, no need to set the value again
          trigger()
        })

        return {
          get: () => {
            track()
            return value
          },
          set: () => {},
        }
      }).value,
  )
}

export function useEditorSelectionStart(
  editor: monaco.editor.IStandaloneCodeEditor,
) {
  const selection = useEditorCursorSelection(editor)
  return computed(() => {
    return selection.value?.getStartPosition() ?? null
  })
}

export function useEditorCursorPosition(
  editor: monaco.editor.IStandaloneCodeEditor,
) {
  const selection = useEditorCursorSelection(editor)
  return computed(() => {
    return selection.value?.getPosition() ?? null
  })
}
