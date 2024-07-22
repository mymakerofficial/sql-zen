import { useActualColorMode } from '@/composables/useActualColorMode'
import { getThemeFromMode } from '@/lib/highlighter'
import { toValue } from '@vueuse/core'
import { watch } from 'vue'
import type { UseEditor } from '@/composables/editor/useEditor'

export default function themePlugin({ editor }: UseEditor) {
  const colorMode = useActualColorMode()

  function update() {
    editor.updateOptions({
      theme: getThemeFromMode(toValue(colorMode)),
    })
  }

  watch(colorMode, update, { immediate: true })
}
