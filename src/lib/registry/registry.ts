import {
  DataSourceFactory,
  type DataSourceInfo,
} from '@/lib/databases/dataSourceFactory'
import type { DataSourceFacade } from '@/lib/databases/database'
import { Runner } from '@/lib/runner/runner'
import { djb2 } from '@/lib/hash'

export const DataSourceState = {
  Stopped: 'stopped',
  Ready: 'ready',
} as const
export type DataSourceState =
  (typeof DataSourceState)[keyof typeof DataSourceState]

type DataSourceBase = DataSourceInfo & {
  state: DataSourceState
  key: string
}

export type DataSourceReady = DataSourceBase & {
  state: typeof DataSourceState.Ready
  dataSource: DataSourceFacade
  runner: Runner
}

export type DataSourceStopped = DataSourceBase & {
  state: typeof DataSourceState.Stopped
  dataSource: null
  runner: null
}

export type DataSource = DataSourceReady | DataSourceStopped

export type RegistryPlugin = (registry: Registry) => void

/***
 * Manages the registration of active and inactive data sources.
 */
export class Registry {
  private dataSources: Record<string, DataSource> = {}
  protected listeners: Array<() => void> = []

  on(callback: () => void) {
    this.listeners.push(callback)
  }

  off(callback: () => void) {
    this.listeners = this.listeners.filter((listener) => listener !== callback)
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener())
  }

  use(plugin: RegistryPlugin) {
    plugin(this)
  }

  /**
   * Register a database with the registry.
   */
  register(info: DataSourceInfo) {
    const key = generateKey(info)
    if (this.dataSources[key]) {
      throw new Error(`Database already registered: ${key}`)
    }
    const dataSource: DataSource = {
      ...info,
      key,
      state: DataSourceState.Stopped,
      dataSource: null,
      runner: null,
    }
    this.dataSources[key] = dataSource
    this.notifyListeners()
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

  wake(key: string) {
    const entry = this.getDataSource(key)
    if (entry.state === DataSourceState.Ready) {
      return entry as unknown as DataSourceReady
    }

    const dataSource = DataSourceFactory.createDataSource(entry)
    const runner = new Runner(dataSource)
    Object.assign(entry, {
      state: DataSourceState.Ready,
      dataSource,
      runner,
    })

    // Initialize the database
    dataSource.init().then()

    this.notifyListeners()
    return entry as unknown as DataSourceReady
  }

  async stop(key: string) {
    const entry = this.getDataSource(key)
    if (entry.state === DataSourceState.Stopped) {
      throw new Error(`Database already stopped: ${key}`)
    }

    await entry.dataSource.close()
    Object.assign(entry, {
      state: DataSourceState.Stopped,
      dataSource: null,
      runner: null,
    })

    this.notifyListeners()
    return entry as unknown as DataSourceStopped
  }

  async unregister(key: string) {
    await this.stop(key)
    delete this.dataSources[key]
    this.notifyListeners()
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
