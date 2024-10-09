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
    return this.getDataSource(key).status
  }

  register(info: DataSourceData): string {
    const dataSource = DataSourceFactory.create(info)
    if (this.#dataSources.has(dataSource.key)) {
      // ignore duplicate keys
      return dataSource.key
    }
    // TODO: check for duplicate display names
    this.#dataSources.set(dataSource.key, dataSource)
    this.emit(RegistryEvent.Registered, dataSource.key)
    return dataSource.key
  }

  async asyncStart(key: string) {
    const dataSource = this.getDataSource(key)

    const startTime = Date.now()
    this.emit(RegistryEvent.Initializing, key)
    await dataSource.init()
    const endTime = Date.now()
    const duration = endTime - startTime
    this.emit(RegistryEvent.Initialized, key, duration)
  }

  start(key: string) {
    this.asyncStart(key).then()
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
