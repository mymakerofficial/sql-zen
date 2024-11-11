import { RegistryEvent } from '@/lib/registry/events'
import type { DataSourceBase, DataSourceInfo } from '@/lib/dataSources/types'
import type { Registry } from '@/lib/registry/impl/registry'
import { FileAccessor } from '@/lib/files/fileAccessor'
import { generateDataSourceKey } from '@/lib/dataSources/helpers'

type Data = Omit<DataSourceInfo, 'fileAccessor' | 'status'>

const STORAGE_KEY = 'sql-zen-stored-data-sources'

export function storeDataSources(registry: Registry) {
  const serializedData = localStorage.getItem(STORAGE_KEY)

  if (serializedData) {
    const dataSourceData = JSON.parse(serializedData) as Data[]
    dataSourceData.forEach((it) => {
      const info: DataSourceBase = {
        fileAccessor: FileAccessor.Dummy,
        ...it,
      }
      // for backward compatibility
      //  if id is not provided, generate it as keys were generated before
      const id = it.id ?? generateDataSourceKey(info)

      registry.register(info, id)
    })
    // update in case of version change
    update()
  }

  function update() {
    const data = registry
      .getDataSources()
      .map(({ fileAccessor: _f, status: _s, ...it }) => it) as Data[]

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }

  registry.on(RegistryEvent.Registered, update)
  registry.on(RegistryEvent.Unregistered, update)
}
