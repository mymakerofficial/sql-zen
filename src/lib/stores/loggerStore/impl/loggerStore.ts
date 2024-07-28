import type {
  ILoggerStore,
  LoggerStoreEntry,
} from '@/lib/stores/loggerStore/interface'

export class LoggerStore implements ILoggerStore {
  #store: Map<string, Array<LoggerStoreEntry>> = new Map()

  create(entry: LoggerStoreEntry): void {
    const key = entry.loggerId
    const entries = this.#store.get(key) || []
    entries.push(entry)
    this.#store.set(key, entries)
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
}
