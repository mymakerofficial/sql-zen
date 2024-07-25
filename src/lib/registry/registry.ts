import {
  DataSourceFactory,
  type DataSourceInfo,
} from '@/lib/databases/dataSourceFactory'
import type { DataSourceFacade } from '@/lib/databases/database'
import { Runner } from '@/lib/runner/runner'
import { djb2 } from '@/lib/hash'
import { EventPublisher } from '@/lib/events/publisher'

export const DataSourceState = {
  Stopped: 'stopped',
  Starting: 'starting',
  Running: 'running',
} as const
export type DataSourceState =
  (typeof DataSourceState)[keyof typeof DataSourceState]

type DataSourceBase = DataSourceInfo & {
  state: DataSourceState
  key: string
}

export type DataSourceReady = DataSourceBase & {
  state: typeof DataSourceState.Starting | typeof DataSourceState.Running
  dataSource: DataSourceFacade
  runner: Runner
}

export type DataSourceStopped = DataSourceBase & {
  state: typeof DataSourceState.Stopped
  dataSource: null
  runner: null
}

export type DataSource = DataSourceReady | DataSourceStopped

export type RegistryPlugin<T> = (registry: Registry) => T

export const RegistryEvent = {
  Registered: 'registered',
  Unregistered: 'unregistered',
  Starting: 'starting',
  Running: 'running',
  Stopped: 'stopped',
} as const
export type RegistryEvent = (typeof RegistryEvent)[keyof typeof RegistryEvent]

type RegistryEvents = {
  [RegistryEvent.Registered]: [DataSourceStopped]
  [RegistryEvent.Unregistered]: [string]
  [RegistryEvent.Starting]: [DataSourceReady]
  [RegistryEvent.Running]: [DataSourceReady]
  [RegistryEvent.Stopped]: [DataSourceStopped]
}

/***
 * Manages the registration of active and inactive data sources.
 */
export class Registry extends EventPublisher<RegistryEvents> {
  private dataSources: Record<string, DataSource> = {}

  use<T>(plugin: RegistryPlugin<T>) {
    return plugin(this)
  }

  /**
   * Register a database with the registry.
   */
  register(info: DataSourceInfo) {
    const key = generateKey(info)
    if (this.dataSources[key]) {
      throw new Error(`Data Source already registered: ${key}`)
    }
    const dataSource: DataSourceStopped = {
      ...info,
      key,
      state: DataSourceState.Stopped,
      dataSource: null,
      runner: null,
    }
    this.dataSources[key] = dataSource
    this.emit(RegistryEvent.Registered, dataSource)
    return dataSource
  }

  registerIfNotExists(info: DataSourceInfo) {
    const key = generateKey(info)
    if (this.dataSources[key]) {
      return this.dataSources[key]
    }
    return this.register(info)
  }

  getDataSources() {
    return Object.values(this.dataSources)
  }

  getDataSource(key: string) {
    const database = this.dataSources[key]
    if (!database) {
      throw new Error(`Data Source not registered: ${key}`)
    }
    return database
  }

  getReadyDataSource(key: string) {
    const database = this.getDataSource(key)
    if (database.state === DataSourceState.Stopped) {
      throw new Error(`Data Source not running: ${key}`)
    }
    return database as DataSourceReady
  }

  start(key: string) {
    const entry = this.getDataSource(key) as DataSourceReady
    if (entry.dataSource) {
      return entry
    }

    const dataSource = DataSourceFactory.createDataSource(entry)
    const runner = new Runner(dataSource)
    Object.assign(entry, {
      state: DataSourceState.Starting,
      dataSource,
      runner,
    })

    // Initialize the database
    dataSource.init().then(() => {
      Object.assign(entry, {
        state: DataSourceState.Running,
      })
      this.emit(RegistryEvent.Running, entry)
    })

    this.emit(RegistryEvent.Starting, entry)
    return entry
  }

  async stop(key: string) {
    const entry = this.getDataSource(key)
    if (entry.state === DataSourceState.Stopped) {
      return
    }

    await entry.dataSource.close()
    Object.assign(entry, {
      state: DataSourceState.Stopped,
      dataSource: null,
      runner: null,
    })

    this.emit(RegistryEvent.Stopped, entry as unknown as DataSourceStopped)
    return entry as unknown as DataSourceStopped
  }

  async unregister(key: string) {
    if (!this.dataSources[key]) {
      throw new Error(`Data Source not registered: ${key}`)
    }
    await this.stop(key)
    delete this.dataSources[key]
    this.emit(RegistryEvent.Unregistered, key)
  }

  async dispose() {
    for (const key in this.dataSources) {
      await this.unregister(key)
    }
  }
}

export function generateKey(info: DataSourceInfo): string {
  return djb2(`${info.engine}-${info.mode}-${info.identifier}`)
}
