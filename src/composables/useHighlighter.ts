import { computed, type MaybeRefOrGetter } from 'vue'
import { getThemeFromMode, highlighter } from '@/lib/highlighter'
import { toValue } from '@vueuse/core'
import { useActualColorMode } from '@/composables/useActualColorMode'

export function useHighlight(code: MaybeRefOrGetter<string>) {
  const mode = useActualColorMode()

  return computed(() => {
    return highlighter.codeToHtml(toValue(code), {
      lang: 'sql',
      theme: getThemeFromMode(mode.value),
    })
  })
}
