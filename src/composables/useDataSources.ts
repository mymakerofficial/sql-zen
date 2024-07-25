import { onMounted, onUnmounted, type Ref, ref } from 'vue'
import type { DataSource } from '@/lib/registry/registry'
import { useRegistry } from '@/composables/useRegistry'
import { EventType } from '@/lib/events/publisher'

export function useDataSources() {
  const registry = useRegistry()

  const dataSources = ref([]) as Ref<Array<DataSource>>

  update()

  function update() {
    // we need to create a new array to trigger reactivity
    dataSources.value = [...registry.getDataSources()]
  }

  onMounted(() => {
    registry.on(EventType.Any, () => update())
  })

  onUnmounted(() => {
    registry.off(EventType.Any, () => update())
  })

  return dataSources
}
