import type { ComputedRef } from 'vue'
import { computed, customRef } from 'vue'

export function useState<T>(
  initialValue: T,
): [ComputedRef<T>, (value: T) => void] {
  let updateValue: (value: T) => void
  const ref = customRef((track, trigger) => {
    let _value = initialValue
    updateValue = (newValue) => {
      _value = newValue
      trigger()
    }
    return {
      get() {
        track()
        return _value
      },
      set(_newValue: T) {},
    }
  })

  return [computed(() => ref.value), updateValue!]
}
