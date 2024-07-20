import { useColorMode } from '@vueuse/core'
import { computed } from 'vue'

export function useActualColorMode() {
  const { system, state } = useColorMode()

  return computed(() => (state.value === 'system' ? system.value : state.value))
}
