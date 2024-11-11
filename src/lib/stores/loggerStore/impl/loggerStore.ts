import type {
  ILoggerStore,
  LoggerStoreEntry,
} from '@/lib/stores/loggerStore/interface'

export class LoggerStore implements ILoggerStore {
  #store: Map<string, Array<LoggerStoreEntry>> = new Map()

  create(entry: LoggerStoreEntry): void {
    const id = entry.loggerId
    const entries = this.#store.get(id) || []
    entries.push(entry)
    this.#store.set(id, entries)
  }

  update(
    loggerId: string,
    eventId: string,
    data: Partial<LoggerStoreEntry>,
  ): void {
    const entries = this.#store.get(loggerId) || []
    const index = entries.findIndex((entry) => entry.eventId === eventId)
    if (index === -1) {
      return
    }
    entries[index] = {
      ...entries[index],
      ...data,
    }
    this.#store.set(loggerId, entries)
  }

  getAllFromLogger(loggerId: string): Array<LoggerStoreEntry> {
    return this.#store.get(loggerId) || []
  }

  clearLogger(loggerId: string): void {
    this.#store.set(loggerId, [])
  }
}
