import {
  DatabaseFactory,
  type DatabaseInfo,
} from '@/lib/databases/databaseFactory'
import type { DatabaseFacade } from '@/lib/databases/database'
import { Runner } from '@/lib/runner/runner'
import { djb2 } from '@/lib/hash'

export const DatabaseState = {
  Stopped: 'stopped',
  Ready: 'ready',
} as const
export type DatabaseState = (typeof DatabaseState)[keyof typeof DatabaseState]

type RegisteredDatabaseBase = {
  key: string
}

export type RegisteredReadyDatabase = DatabaseInfo &
  RegisteredDatabaseBase & {
    state: typeof DatabaseState.Ready
    database: DatabaseFacade
    runner: Runner
  }

export type RegisteredStoppedDatabase = DatabaseInfo &
  RegisteredDatabaseBase & {
    state: typeof DatabaseState.Stopped
    database: null
    runner: null
  }

export type RegisteredDatabase =
  | RegisteredReadyDatabase
  | RegisteredStoppedDatabase

export type RegistryPlugin = (registry: Registry) => void

/***
 * Manages the registration of active and inactive databases.
 */
export class Registry {
  private databases: Record<string, RegisteredDatabase> = {}
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
  register(info: DatabaseInfo) {
    const key = generateKey(info)
    if (this.databases[key]) {
      throw new Error(`Database already registered: ${key}`)
    }
    const database = {
      ...info,
      key,
      state: DatabaseState.Stopped,
      database: null,
      runner: null,
    }
    this.databases[key] = database
    this.notifyListeners()
    return database
  }

  registerIfNotExists(info: DatabaseInfo) {
    const key = generateKey(info)
    if (this.databases[key]) {
      return this.databases[key]
    }
    return this.register(info)
  }

  getDatabases() {
    return Object.values(this.databases)
  }

  getDatabase(key: string) {
    const database = this.databases[key]
    if (!database) {
      throw new Error(`Database not registered: ${key}`)
    }
    return database
  }

  wake(key: string) {
    const entry = this.getDatabase(key)
    if (entry.state === DatabaseState.Ready) {
      return entry as unknown as RegisteredReadyDatabase
    }

    const database = DatabaseFactory.createDatabase(entry)
    const runner = new Runner(database)
    Object.assign(entry, {
      state: DatabaseState.Ready,
      database,
      runner,
    })

    this.notifyListeners()
    return entry as unknown as RegisteredReadyDatabase
  }

  async stop(key: string) {
    const entry = this.getDatabase(key)
    if (entry.state === DatabaseState.Stopped) {
      throw new Error(`Database already stopped: ${key}`)
    }

    await entry.database.close()
    Object.assign(entry, {
      state: DatabaseState.Stopped,
      database: null,
      runner: null,
    })

    this.notifyListeners()
    return entry as unknown as RegisteredStoppedDatabase
  }

  async unregister(key: string) {
    await this.stop(key)
    delete this.databases[key]
    this.notifyListeners()
  }

  async dispose() {
    for (const key in this.databases) {
      await this.unregister(key)
    }
  }
}

function generateKey(info: DatabaseInfo): string {
  return djb2(`${info.engine}-${info.mode}-${info.identifier}`)
}
