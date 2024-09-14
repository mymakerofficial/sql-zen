import { ref, type Ref } from 'vue'
import { makeDestructurable, watchDebounced } from '@vueuse/core'

export type FlushableOptions<T> = {
  validate?: (value: T) => boolean
  debounce?: number
}

export function useFlushableRef<T>(
  target: Ref<T>,
  options: FlushableOptions<T> = {},
) {
  const value = ref(target.value) as Ref<T>

  function flush() {
    if (options.validate && !options.validate(value.value)) {
      value.value = target.value
      return
    }

    value.value = target.value
  }

  if (options.debounce) {
    watchDebounced(target, flush, options)
  }

  return makeDestructurable({ value, flush } as const, [value, flush] as const)
}
