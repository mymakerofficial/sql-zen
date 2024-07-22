import * as monaco from 'monaco-editor'
import { useActualColorMode } from '@/composables/useActualColorMode'
import { getThemeFromMode } from '@/lib/highlighter'
import { toValue } from '@vueuse/core'
import { watch } from 'vue'

export default function themePlugin(
  editor: monaco.editor.IStandaloneCodeEditor,
) {
  const colorMode = useActualColorMode()

  function update() {
    editor.updateOptions({
      theme: getThemeFromMode(toValue(colorMode)),
    })
  }

  watch(colorMode, update, { immediate: true })
}
