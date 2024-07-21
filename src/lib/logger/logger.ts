import type { QueryResult } from '@/lib/databases/database'

export const LogEventType = {
  Query: 'query',
} as const
export type LogEventType = (typeof LogEventType)[keyof typeof LogEventType]

export const QueryState = {
  Pending: 'pending',
  Success: 'success',
  Error: 'error',
} as const
export type QueryState = (typeof QueryState)[keyof typeof QueryState]

type LogEventBase = {
  type: LogEventType
  id: number
  key: string
}

export type QueryLogEvent = LogEventBase & {
  type: typeof LogEventType.Query
  sql: string
} & (
    | {
        state: typeof QueryState.Pending
      }
    | {
        state: typeof QueryState.Success
        result: QueryResult
      }
    | {
        state: typeof QueryState.Error
        error: Error
      }
  )

export type LogEvent = QueryLogEvent

export class Logger {
  private count = 0
  private events: Array<LogEvent> = []
  private listeners: Array<(event: LogEvent) => void> = []

  getEvents() {
    return this.events
  }

  on(callback: (event: LogEvent) => void) {
    this.listeners.push(callback)
  }

  off(callback: (event: LogEvent) => void) {
    this.listeners = this.listeners.filter((listener) => listener !== callback)
  }

  private notifyListeners(event: LogEvent) {
    this.listeners.forEach((listener) => listener(event))
  }

  private computeEventKey(event: Partial<LogEvent>) {
    return [event.id, event.type, event.state].join('-')
  }

  private logEvent(
    type: LogEventType,
    info: Omit<LogEvent, keyof LogEventBase>,
  ) {
    const id = this.count++
    const event = {
      type,
      id,
      key: this.computeEventKey({ type, id, ...info }),
      ...info,
    } as LogEvent
    this.events.push(event)
    this.notifyListeners(event)
    return event
  }

  query(sql: string) {
    const event = this.logEvent(LogEventType.Query, {
      sql,
      state: QueryState.Pending,
    })

    const success = (result: QueryResult) => {
      Object.assign(event, {
        state: QueryState.Success,
        result,
        key: this.computeEventKey({ ...event, state: QueryState.Success }),
      })
      this.notifyListeners(event)
      return result
    }

    const error = (error: Error) => {
      Object.assign(event, {
        state: QueryState.Error,
        error,
        key: this.computeEventKey({ ...event, state: QueryState.Error }),
      })
      this.notifyListeners(event)
      return error
    }

    return { success, error }
  }
}
