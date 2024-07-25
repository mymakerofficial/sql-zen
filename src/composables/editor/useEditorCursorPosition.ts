import { computed, customRef } from 'vue'
import * as monaco from 'monaco-editor'

export function useEditorCursorPosition(
  editor: monaco.editor.IStandaloneCodeEditor,
) {
  return computed(
    () =>
      customRef((track, trigger) => {
        let value = editor.getSelection()?.getPosition() ?? null

        editor.onDidChangeCursorPosition(() => {
          value = editor.getSelection()?.getPosition() ?? null
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
