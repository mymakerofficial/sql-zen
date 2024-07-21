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
}

export type MessageLogEvent = {
  type: typeof LogEventType.Message
  message: string
}

export type QueryLogEvent = {
  type: typeof LogEventType.Query
  sql: string
} & (
  | {
      state: typeof PromiseState.Pending
    }
  | {
      state: typeof PromiseState.Success
      result: QueryResult
    }
  | {
      state: typeof PromiseState.Error
      error: Error
    }
)

export type StepLogEvent = {
  type: typeof LogEventType.Step
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

type AbstractLogEvent = MessageLogEvent | QueryLogEvent | StepLogEvent

export type LogEvent = LogEventBase & AbstractLogEvent

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

  private logEvent<TEvent extends AbstractLogEvent>(data: TEvent) {
    const id = this.count++
    const event = {
      id,
      key: this.computeEventKey({ id, ...data }),
      ...data,
    } as TEvent & LogEventBase
    this.events.push(event)
    this.notifyListeners(event)
    return event
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

    const success = (result: QueryResult) => {
      Object.assign(event, {
        state: PromiseState.Success,
        result,
        key: this.computeEventKey({ ...event, state: PromiseState.Success }),
      })
      this.notifyListeners(event)
      return result
    }

    const error = (error: Error) => {
      Object.assign(event, {
        state: PromiseState.Error,
        error,
        key: this.computeEventKey({ ...event, state: PromiseState.Error }),
      })
      this.notifyListeners(event)
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
      this.notifyListeners(event)
    }

    const error = (error: Error) => {
      Object.assign(event, {
        state: PromiseState.Error,
        error,
        key: this.computeEventKey({ ...event, state: PromiseState.Error }),
      })
      this.notifyListeners(event)
      return error
    }

    return { success, error }
  }
}
