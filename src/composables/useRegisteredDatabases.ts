import { onMounted, onUnmounted, type Ref, ref } from 'vue'
import type { RegisteredDatabase } from '@/lib/registry/registry'
import { useRegistry } from '@/composables/useRegistry'

export function useRegisteredDatabases() {
  const registry = useRegistry()

  const databases = ref([]) as Ref<Array<RegisteredDatabase>>

  update()

  function update() {
    // we need to create a new array to trigger reactivity
    databases.value = [...registry.getDatabases()]
  }

  onMounted(() => {
    registry.on(() => update())
  })

  onUnmounted(() => {
    registry.off(() => update())
  })

  return databases
}
