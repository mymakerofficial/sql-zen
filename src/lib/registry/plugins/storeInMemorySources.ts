import type { IRegistry } from '@/lib/registry/interface'
import type { DataSourceDescriptor } from '@/lib/dataSources/interface'
import { DataSourceMode } from '@/lib/dataSources/enums'
import { RegistryEvent } from '@/lib/registry/events'

type Data = Pick<DataSourceDescriptor, 'engine' | 'identifier'>

const storageKey = 'sql-zen-in-memory-sources'

export function storeInMemorySources(registry: IRegistry) {
  const stored = localStorage.getItem(storageKey)

  if (stored) {
    const data = JSON.parse(stored) as Data[]
    data.forEach((it) => {
      registry.register({
        engine: it.engine,
        mode: DataSourceMode.Memory,
        identifier: it.identifier,
      })
    })
  }

  function update() {
    const data = registry
      .getDescriptors()
      .filter((it) => it.mode === DataSourceMode.Memory)
      .map((it) => ({
        engine: it.engine,
        identifier: it.identifier,
      })) as Data[]

    localStorage.setItem(storageKey, JSON.stringify(data))
  }

  registry.on(RegistryEvent.Registered, update)
  registry.on(RegistryEvent.Unregistered, update)
}
