import { RegistryEvent } from '@/lib/registry/events'
import type { DataSourceInfo } from '@/lib/dataSources/types'
import type { Registry } from '@/lib/registry/impl/registry'
import { FileAccessor } from '@/lib/files/fileAccessor'

type Data = Omit<DataSourceInfo, 'fileAccessor' | 'key' | 'status'>

const storageKey = 'sql-zen-stored-data-sources'

export function storeDataSources(registry: Registry) {
  const stored = localStorage.getItem(storageKey)

  if (stored) {
    const data = JSON.parse(stored) as Data[]
    data.forEach((it) => {
      registry.register({
        fileAccessor: FileAccessor.Dummy,
        ...it,
      })
    })
  }

  function update() {
    const data = registry
      .getDataSources()
      .map(({ fileAccessor: _f, key: _k, status: _s, ...it }) => it) as Data[]

    localStorage.setItem(storageKey, JSON.stringify(data))
  }

  registry.on(RegistryEvent.Registered, update)
  registry.on(RegistryEvent.Unregistered, update)
}
