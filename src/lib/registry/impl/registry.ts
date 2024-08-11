import { EventPublisher } from '@/lib/events/publisher'
import { RegistryEvent, type RegistryEventMap } from '@/lib/registry/events'
import { Runner } from '@/lib/runner/impl/runner'
import { DataSourceFactory } from '@/lib/dataSources/factory'
import type { DataSourceData, DataSourceInfo } from '@/lib/dataSources/types'
import type { DataSource } from '@/lib/dataSources/impl/base'
import type { DataSourceStatus } from '@/lib/dataSources/enums'
import { DataSourceEvent } from '@/lib/dataSources/events'

export class Registry extends EventPublisher<RegistryEventMap> {
  #dataSources: Map<string, DataSource> = new Map()

  use<T>(plugin: (registry: Registry) => T): T {
    return plugin(this)
  }

  getDataSourceKeys(): Array<string> {
    return Array.from(this.#dataSources.keys())
  }

  getDataSources(): Array<DataSourceInfo> {
    return this.getDataSourceKeys().map((key) =>
      this.getDataSource(key).getInfo(),
    )
  }

  getDataSource(key: string): DataSource {
    return this.#dataSources.get(key) ?? DataSourceFactory.dummy
  }

  getRunner(key: string): Runner {
    return this.getDataSource(key).getRunner()
  }

  getInfo(key: string): DataSourceInfo {
    return this.getDataSource(key).getInfo()
  }

  getStatus(key: string): DataSourceStatus {
    return this.getDataSource(key).getStatus()
  }

  register(info: DataSourceData): void {
    const dataSource = DataSourceFactory.create(info)
    this.#dataSources.set(dataSource.key, dataSource)
    this.emit(RegistryEvent.Registered, dataSource.key)
  }

  start(key: string) {
    const dataSource = this.getDataSource(key)

    dataSource.once(DataSourceEvent.Initializing, () => {
      this.emit(RegistryEvent.Initializing, key)
    })
    dataSource.once(DataSourceEvent.Initialized, () => {
      this.emit(RegistryEvent.Initialized, key)
    })
    dataSource.init().then()
  }

  async close(key: string) {
    const dataSource = this.getDataSource(key)

    dataSource.once(DataSourceEvent.Closing, () => {
      this.emit(RegistryEvent.Closing, key)
    })
    dataSource.once(DataSourceEvent.Closed, () => {
      this.emit(RegistryEvent.Closed, key)
    })
    await dataSource.close()
  }

  async unregister(key: string) {
    await this.close(key)
    this.#dataSources.delete(key)
    this.emit(RegistryEvent.Unregistered, key)
  }
}
