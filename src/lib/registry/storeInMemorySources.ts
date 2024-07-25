import { type Registry, RegistryEvent } from '@/lib/registry/registry'
import { DatabaseEngineMode } from '@/lib/databases/database'
import type { DataSourceInfo } from '@/lib/databases/dataSourceFactory'

type Data = Pick<DataSourceInfo, 'engine' | 'identifier'>

const storageKey = 'sql-zen-in-memory-sources'

export function storeInMemorySources(registry: Registry) {
  const stored = localStorage.getItem(storageKey)

  if (stored) {
    const data = JSON.parse(stored) as Data[]
    data.forEach((it) => {
      registry.register({
        engine: it.engine,
        mode: DatabaseEngineMode.Memory,
        identifier: it.identifier,
        fileAccessor: null,
      })
    })
  }

  function update() {
    const data = registry
      .getDataSources()
      .filter((it) => it.mode === DatabaseEngineMode.Memory)
      .map((it) => ({
        engine: it.engine,
        identifier: it.identifier,
      }))

    localStorage.setItem(storageKey, JSON.stringify(data))
  }

  registry.on(RegistryEvent.Registered, update)
  registry.on(RegistryEvent.Unregistered, update)
}
