import type {
  DataSourceCompleteDescriptor,
  DataSourceDescriptor,
  IDataSource,
} from '@/lib/dataSources/interface'
import type { IRunner } from '@/lib/runner/interface'
import { EventPublisher } from '@/lib/events/publisher'
import type { RegistryEventMap } from '@/lib/registry/events'
import type { ILogger } from '@/lib/logger/interface'
import type { DataSourceStatus } from '@/lib/registry/enums'

export type RegistryPlugin<T> = (registry: IRegistry) => T

export interface IRegistry extends EventPublisher<RegistryEventMap> {
  use<T>(plugin: RegistryPlugin<T>): T
  // registers a data source and creates its runner
  register(descriptor: DataSourceCompleteDescriptor): void
  // gets a list of all the data source keys
  getDataSourceKeys(): Array<string>
  // gets a list of all data source descriptors
  getDescriptors(): Array<DataSourceDescriptor>
  // gets the descriptor for a data source
  getDescriptor(key: string): DataSourceDescriptor
  // gets the status of a data source
  getStatus(key: string): DataSourceStatus
  // gets the runner for a data source
  getRunner(key: string): IRunner
  // gets the data source from the registry
  getDataSource(key: string): IDataSource
  // gets the logger for a data source
  getLogger(key: string): ILogger
  // starts the connection to a data source
  start(key: string): void
  // closes the connection to a data source, might lose the data
  close(key: string): Promise<void>
  // closes the data source and removes it from the registry
  unregister(key: string): Promise<void>
}
