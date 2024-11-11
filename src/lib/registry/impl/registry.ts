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

  getDataSourceIds(): Array<string> {
    return Array.from(this.#dataSources.keys())
  }

  getDataSources(): Array<DataSourceInfo> {
    return this.getDataSourceIds().map((id) => this.getDataSource(id).getInfo())
  }

  getDataSource(id: string): DataSource {
    return this.#dataSources.get(id) ?? DataSourceFactory.dummy
  }

  getRunner(id: string): Runner {
    return this.getDataSource(id).getRunner()
  }

  getInfo(id: string): DataSourceInfo {
    return this.getDataSource(id).getInfo()
  }

  getStatus(id: string): DataSourceStatus {
    return this.getDataSource(id).status
  }

  register(info: DataSourceData, id?: string): string {
    const dataSource = DataSourceFactory.create(info, id)
    if (this.#dataSources.has(dataSource.id)) {
      // ignore duplicate ids
      return dataSource.id
    }
    // TODO: check for duplicate display names
    this.#dataSources.set(dataSource.id, dataSource)
    this.emit(RegistryEvent.Registered, dataSource.id)
    return dataSource.id
  }

  async asyncStart(id: string) {
    const dataSource = this.getDataSource(id)

    const startTime = Date.now()
    this.emit(RegistryEvent.Initializing, id)
    await dataSource.init()
    const endTime = Date.now()
    const duration = endTime - startTime
    this.emit(RegistryEvent.Initialized, id, duration)
  }

  start(id: string) {
    this.asyncStart(id).then()
  }

  async close(id: string) {
    const dataSource = this.getDataSource(id)

    dataSource.once(DataSourceEvent.Closing, () => {
      this.emit(RegistryEvent.Closing, id)
    })
    dataSource.once(DataSourceEvent.Closed, () => {
      this.emit(RegistryEvent.Closed, id)
    })
    await dataSource.close()
  }

  async unregister(id: string) {
    await this.close(id)
    this.#dataSources.delete(id)
    this.emit(RegistryEvent.Unregistered, id)
  }
}
