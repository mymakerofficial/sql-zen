import { EventPublisher } from '@/lib/events/publisher'
import { RegistryEvent, type RegistryEventMap } from '@/lib/registry/events'
import { Runner } from '@/lib/runner/impl/runner'
import { DataSourceFactory } from '@/lib/dataSources/factory'
import type { DataSourceData, DataSourceInfo } from '@/lib/dataSources/types'
import type { DataSource } from '@/lib/dataSources/impl/base'
import type { DataSourceStatus } from '@/lib/dataSources/enums'
import { DataSourceEvent } from '@/lib/dataSources/events'

const dummyRunner = new Runner(DataSourceFactory.dummy)

export class Registry extends EventPublisher<RegistryEventMap> {
  #runners: Map<string, Runner> = new Map()

  use<T>(plugin: (registry: Registry) => T): T {
    return plugin(this)
  }

  getDataSourceKeys(): Array<string> {
    return Array.from(this.#runners.keys())
  }

  getDataSources(): Array<DataSourceInfo> {
    return this.getDataSourceKeys().map((key) =>
      this.getDataSource(key).getInfo(),
    )
  }

  getRunner(key: string): Runner {
    return this.#runners.get(key) ?? dummyRunner
  }

  getDataSource(key: string): DataSource {
    return this.getRunner(key).getDataSource()
  }

  getInfo(key: string): DataSourceInfo {
    return this.getDataSource(key).getInfo()
  }

  getStatus(key: string): DataSourceStatus {
    return this.getDataSource(key).getStatus()
  }

  register(info: DataSourceData): void {
    const dataSource = DataSourceFactory.create(info)
    this.#runners.set(dataSource.key, Runner.for(dataSource))
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
    this.#runners.delete(key)
    this.emit(RegistryEvent.Unregistered, key)
  }
}
