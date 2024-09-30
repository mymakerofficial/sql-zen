import { EventPublisher } from '@/lib/events/publisher'
import { LoggerEvent, type LoggerEventMap } from '@/lib/logger/events'
import type { LogEvent, LogEventData } from '@/lib/logger/interface'
import type { ILoggerStore } from '@/lib/stores/loggerStore/interface'
import {
  logEventDataUpdateToStoreEntryUpdate,
  logEventToLoggerStoreEntry,
  loggerStoreEntryToLogEvent,
} from '@/lib/stores/loggerStore/helpers'
import { LogEventType, PromiseState } from '@/lib/logger/enums'
import { createLogEvent } from '@/lib/logger/helpers'
import type { QueryResult } from '@/lib/queries/interface'
import { getId } from '@/lib/getId'
import { LoggerStore } from '@/lib/stores/loggerStore/impl/loggerStore'

export class Logger extends EventPublisher<LoggerEventMap> {
  static #loggers: Map<string, Logger> = new Map()

  readonly #id: string
  readonly #store: ILoggerStore

  constructor() {
    super()
    this.#id = getId()
    this.#store = new LoggerStore()
    Logger.#loggers.set(this.getId(), this)
  }

  static getLogger(id: string): Logger {
    return Logger.#loggers.get(id) ?? new Logger()
  }

  getId(): string {
    return this.#id
  }

  get id() {
    return this.getId()
  }

  getEvents() {
    return this.#store
      .getAllFromLogger(this.getId())
      .map(loggerStoreEntryToLogEvent)
  }

  #create(partial: Omit<LogEvent, 'id' | 'when'>) {
    const event = createLogEvent(partial)
    this.#store.create(logEventToLoggerStoreEntry(event, this.getId()))
    this.emit(LoggerEvent.Logged, event.id)
    return event.id
  }

  #update(id: string, data: Partial<LogEventData>) {
    this.#store.update(
      this.getId(),
      id,
      logEventDataUpdateToStoreEntryUpdate(data),
    )
    this.emit(LoggerEvent.Updated, id)
  }

  log(message: string) {
    this.#create({
      type: LogEventType.Message,
      data: { message },
    })
  }

  error(message: string) {
    this.#create({
      type: LogEventType.Error,
      data: { message },
    })
  }

  query<T extends object = object>(
    sql: string,
    block: () => Promise<QueryResult<T>>,
  ): Promise<QueryResult<T>> {
    const eventId = this.#create({
      type: LogEventType.Query,
      data: { sql, state: PromiseState.Pending },
    })
    return block().then(
      (result) => {
        this.#update(eventId, {
          state: PromiseState.Success,
          resultId: result.id,
          rowCount: result.rows.length,
          affectedRows: result.affectedRows,
          duration: result.duration,
        })
        return result
      },
      (error) => {
        this.#update(eventId, {
          state: PromiseState.Error,
          errorMessage: error.message,
        })
        throw error
      },
    )
  }

  step<T>(message: string, block: () => Promise<T>): Promise<T> {
    const eventId = this.#create({
      type: LogEventType.Step,
      data: { message, state: PromiseState.Pending },
    })
    return block().then(
      (result) => {
        this.#update(eventId, {
          state: PromiseState.Success,
        })
        return result
      },
      (error) => {
        this.#update(eventId, {
          state: PromiseState.Error,
          errorMessage: error.message ?? error,
        })
        throw error
      },
    )
  }

  clear() {
    this.#store.clearLogger(this.getId())
    this.emit(LoggerEvent.Cleared)
  }
}
