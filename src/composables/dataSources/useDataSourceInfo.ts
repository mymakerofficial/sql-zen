import { type MaybeRefOrGetter, toValue, watchEffect } from 'vue'
import { useState } from '@/composables/useState'
import { EventType } from '@/lib/events/publisher'
import { useRegistry } from '@/composables/useRegistry'
import { DataSourceFactory } from '@/lib/dataSources/factory'

export function useDataSourceInfo(dataSourceKey: MaybeRefOrGetter<string>) {
  const registry = useRegistry()
  const [info, setInfo] = useState(DataSourceFactory.dummy.getInfo())

  watchEffect((onCleanup) => {
    const dataSource = registry.getDataSource(toValue(dataSourceKey))

    function handle() {
      setInfo(dataSource.getInfo())
    }
    handle()

    dataSource.on(EventType.Any, handle)

    onCleanup(() => {
      dataSource.off(EventType.Any, handle)
    })
  })

  return info
}