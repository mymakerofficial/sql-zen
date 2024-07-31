import { computed, customRef } from 'vue'
import * as monaco from 'monaco-editor'

export function useEditorCursorSelection(
  editor: monaco.editor.IStandaloneCodeEditor,
) {
  return computed(
    () =>
      customRef((track, trigger) => {
        let value = editor.getSelection() ?? null

        editor.onDidChangeCursorSelection(() => {
          value = editor.getSelection() ?? null
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
