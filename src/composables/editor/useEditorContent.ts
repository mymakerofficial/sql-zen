import { computed, customRef } from 'vue'
import * as monaco from 'monaco-editor'

export function useEditorContent(editor: monaco.editor.IStandaloneCodeEditor) {
  return computed(
    () =>
      customRef((track, trigger) => {
        let value = editor.getValue()

        editor.onDidChangeModelContent(() => {
          value = editor.getValue()
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
