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

  const handler = () => update()

  onMounted(() => {
    registry.on(EventType.Any, handler)
  })

  onUnmounted(() => {
    registry.off(EventType.Any, handler)
  })

  return dataSources
}
