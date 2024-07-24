import type { QueryResult } from '@/lib/databases/database'

export const LogEventType = {
  Message: 'message',
  Query: 'query',
  Step: 'step',
} as const
export type LogEventType = (typeof LogEventType)[keyof typeof LogEventType]

export const PromiseState = {
  Pending: 'pending',
  Success: 'success',
  Error: 'error',
} as const
export type PromiseState = (typeof PromiseState)[keyof typeof PromiseState]

type LogEventBase = {
  type: LogEventType
  id: number
  key: string
  date: Date
}

export type MessageLogEvent = LogEventBase & {
  type: typeof LogEventType.Message
  message: string
}

export type QueryLogEvent = LogEventBase & {
  type: typeof LogEventType.Query
  sql: string
} & (
    | {
        state: typeof PromiseState.Pending
      }
    | {
        state: typeof PromiseState.Success
        result: QueryResult
        finishDate: Date
      }
    | {
        state: typeof PromiseState.Error
        error: Error
        finishDate: Date
      }
  )

export type StepLogEvent = LogEventBase & {
  type: typeof LogEventType.Step
  message: string
} & (
    | {
        state: typeof PromiseState.Pending
      }
    | {
        state: typeof PromiseState.Success
      }
    | {
        state: typeof PromiseState.Error
        error: Error
      }
  )

export type LogEvent = MessageLogEvent | QueryLogEvent | StepLogEvent

export class Logger {
  private count = 0
  private events: Array<LogEvent> = []
  private listeners: Array<() => void> = []

  getEvents() {
    return this.events
  }

  on(callback: () => void) {
    this.listeners.push(callback)
  }

  off(callback: () => void) {
    this.listeners = this.listeners.filter((listener) => listener !== callback)
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener())
  }

  private computeEventKey(event: Partial<LogEvent>) {
    return [
      event.id,
      event.type,
      event.type === LogEventType.Query || event.type === LogEventType.Step
        ? event.state
        : undefined,
    ]
      .filter((it) => !!it)
      .join('-')
  }

  private logEvent<TEvent extends Omit<LogEvent, keyof LogEventBase>>(
    data: TEvent,
  ) {
    const id = this.count++
    const event = {
      id,
      key: this.computeEventKey({ id, ...data }),
      date: new Date(),
      ...data,
    } as unknown as LogEvent
    this.events.push(event)
    this.notifyListeners()
    return event
  }

  clear() {
    this.events = []
    this.notifyListeners()
  }

  log(message: string) {
    this.logEvent({ type: LogEventType.Message, message })
  }

  query(sql: string) {
    const event = this.logEvent({
      type: LogEventType.Query,
      sql,
      state: PromiseState.Pending,
    })

    const success = <T = Object>(result: QueryResult<T>) => {
      Object.assign(event, {
        state: PromiseState.Success,
        result,
        finishDate: new Date(),
        key: this.computeEventKey({ ...event, state: PromiseState.Success }),
      })
      this.notifyListeners()
      return result
    }

    const error = (error: Error) => {
      Object.assign(event, {
        state: PromiseState.Error,
        error,
        finishDate: new Date(),
        key: this.computeEventKey({ ...event, state: PromiseState.Error }),
      })
      this.notifyListeners()
      return error
    }

    return { success, error }
  }

  step(message: string) {
    const event = this.logEvent({
      type: LogEventType.Step,
      message,
      state: PromiseState.Pending,
    })

    const success = () => {
      Object.assign(event, {
        state: PromiseState.Success,
        key: this.computeEventKey({ ...event, state: PromiseState.Success }),
      })
      this.notifyListeners()
    }

    const error = (error: Error) => {
      Object.assign(event, {
        state: PromiseState.Error,
        error,
        key: this.computeEventKey({ ...event, state: PromiseState.Error }),
      })
      this.notifyListeners()
      return error
    }

    return { success, error }
  }
}
