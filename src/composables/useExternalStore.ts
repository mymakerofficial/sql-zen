import type { ComputedRef, Ref } from 'vue'
import { computed, customRef } from 'vue'

export function useWritableExternalStore<T>(
  initialValue: T,
  onChange?: (value: T) => void,
): [Ref<T>, (value: T) => void] {
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
      set(_newValue: T) {
        _value = _newValue
        trigger()
        onChange?.(_newValue)
      },
    }
  })

  return [ref, updateValue!]
}

export function useExternalStore<T>(
  initialValue: T,
): [ComputedRef<T>, (value: T) => void] {
  const [ref, updateValue] = useWritableExternalStore(initialValue)
  return [computed(() => ref.value), updateValue!]
}
