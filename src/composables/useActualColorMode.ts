import { useColorMode } from '@vueuse/core'
import { computed } from 'vue'

export function useActualColorMode() {
  const { system, state } = useColorMode()

  // @ts-ignore for some reason, 'system' is not defined in the type definition
  return computed(() => (state.value === 'system' ? system.value : state.value))
}
