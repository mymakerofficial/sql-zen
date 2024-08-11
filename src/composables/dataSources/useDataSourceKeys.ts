import { useState } from '@/composables/useState'
import { onMounted, onUnmounted } from 'vue'
import { useRegistry } from '@/composables/useRegistry'
import { RegistryEvent } from '@/lib/registry/events'

export function useDataSourceKeys() {
  const registry = useRegistry()
  const [datSources, setDatSources] = useState(registry.getDataSourceKeys())

  function handleChange() {
    setDatSources(registry.getDataSourceKeys())
  }

  onMounted(() => {
    registry.on(RegistryEvent.Registered, handleChange)
    registry.on(RegistryEvent.Unregistered, handleChange)
  })

  onUnmounted(() => {
    registry.off(RegistryEvent.Registered, handleChange)
    registry.off(RegistryEvent.Unregistered, handleChange)
  })

  return datSources
}
