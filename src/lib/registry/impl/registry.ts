import { EventPublisher } from '@/lib/events/publisher'
import type { IRegistry } from '@/lib/registry/interface'
import type {
  DataSourceCompleteDescriptor,
  DataSourceDescriptor,
  IDataSource,
} from '@/lib/dataSources/interface'
import type { IRunner } from '@/lib/runner/interface'
import type { ILogger } from '@/lib/logger/interface'
import { generateDataSourceKey } from '@/lib/dataSources/helpers'
import { RegistryEvent, type RegistryEventMap } from '@/lib/registry/events'
import { Runner } from '@/lib/runner/impl/runner'
import { DataSourceStatus } from '@/lib/registry/enums'
import { DataSourceFactory } from '@/lib/dataSources/factory'

type RegistryEntry = {
  descriptor: DataSourceCompleteDescriptor
  runner: IRunner | null
}

export class Registry
  extends EventPublisher<RegistryEventMap>
  implements IRegistry
{
  entries: Map<string, RegistryEntry> = new Map()

  use<T>(plugin: (registry: IRegistry) => T): T {
    return plugin(this)
  }

  register(descriptor: DataSourceCompleteDescriptor): void {
    const key = generateDataSourceKey(descriptor)
    const entry: RegistryEntry = {
      descriptor,
      runner: null,
    }

    this.entries.set(key, entry)

    this.emit(RegistryEvent.Registered, key)
  }

  getDataSourceKeys(): Array<string> {
    return Array.from(this.entries.keys())
  }

  getDescriptors(): Array<DataSourceDescriptor> {
    return Array.from(this.entries.values()).map((entry) =>
      omitDump(entry.descriptor),
    )
  }

  getDescriptor(key: string): DataSourceDescriptor {
    const descriptor = this.entries.get(key)?.descriptor
    if (!descriptor) {
      throw new Error(`Data Source not registered: ${key}`)
    }
    return omitDump(descriptor)
  }

  getStatus(key: string): DataSourceStatus {
    const entry = this.entries.get(key)
    if (!entry) {
      throw new Error(`Data Source not registered: ${key}`)
    }
    if (!entry.runner) {
      return DataSourceStatus.Stopped
    }
    return entry.runner.getDataSource().isInitialized()
      ? DataSourceStatus.Running
      : DataSourceStatus.Pending
  }

  getRunner(key: string): IRunner {
    const entry = this.entries.get(key)
    if (!entry) {
      throw new Error(`Data Source not registered: ${key}`)
    }
    if (!entry.runner) {
      throw new Error(`Data Source not running: ${key}`)
    }
    return entry.runner
  }

  getDataSource(key: string): IDataSource {
    return this.getRunner(key).getDataSource()
  }

  getLogger(key: string): ILogger {
    return this.getDataSource(key).getLogger()
  }

  start(key: string) {
    const entry = this.entries.get(key)
    if (!entry) {
      throw new Error(`Data Source not registered: ${key}`)
    }
    if (entry.runner) {
      return
    }

    const dataSource = DataSourceFactory.create(entry.descriptor)
    const runner = new Runner(dataSource)
    Object.assign(entry, { runner })

    this.emit(RegistryEvent.Initializing, key)
    dataSource.init().then(() => {
      this.emit(RegistryEvent.Initialized, key)
    })
  }

  async close(key: string) {
    const entry = this.entries.get(key)
    if (!entry) {
      throw new Error(`Data Source not registered: ${key}`)
    }
    if (!entry.runner) {
      return
    }

    this.emit(RegistryEvent.Closing, key)
    await entry.runner.getDataSource().close()
    this.emit(RegistryEvent.Closed, key)
  }

  async unregister(key: string) {
    await this.close(key)
    this.entries.delete(key)
    this.emit(RegistryEvent.Unregistered, key)
  }
}

function omitDump(
  descriptor: DataSourceCompleteDescriptor,
): DataSourceDescriptor {
  const { dump: _, ...rest } = descriptor
  return rest
}
