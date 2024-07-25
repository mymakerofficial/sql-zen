import type { QueryResult } from '@/lib/databases/database'
import { EventPublisher } from '@/lib/events/publisher'
import { djb2 } from '@/lib/hash'

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

export const LoggerEvent = {
  Logged: 'logged',
  Updated: 'updated',
  ClearAll: 'clear-all',
} as const
export type LoggerEvent = (typeof LoggerEvent)[keyof typeof LoggerEvent]

type LoggerEvents = {
  [LoggerEvent.Logged]: [LogEvent]
  [LoggerEvent.Updated]: [LogEvent]
  [LoggerEvent.ClearAll]: []
}

export class Logger extends EventPublisher<LoggerEvents> {
  private count = 0
  private events: Array<LogEvent> = []

  getEvents() {
    return this.events
  }

  private computeEventKey(event: Partial<LogEvent>) {
    return djb2(
      JSON.stringify({
        id: event.id,
        type: event.type,
        state: 'state' in event && event.state,
      }),
    )
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
    this.emit(LoggerEvent.Logged, event)
    return event
  }

  clear() {
    this.events = []
    this.emit(LoggerEvent.ClearAll)
  }

  log(message: string) {
    this.logEvent({ type: LogEventType.Message, message })
  }

  private promiselikeEvent<TResult extends unknown, TEvent extends LogEvent>(
    initialEvent: Omit<TEvent, keyof LogEventBase>,
    block: () => Promise<TResult>,
  ) {
    const event = this.logEvent(initialEvent)

    return block()
      .then(
        (result: TResult) => {
          Object.assign(event, {
            state: PromiseState.Success,
            result,
            finishDate: new Date(),
            key: this.computeEventKey({
              ...event,
              state: PromiseState.Success,
            }),
          })
          return result
        },
        (error: Error) => {
          Object.assign(event, {
            state: PromiseState.Error,
            error,
            finishDate: new Date(),
            key: this.computeEventKey({ ...event, state: PromiseState.Error }),
          })
          throw error
        },
      )
      .finally(() => {
        this.emit(LoggerEvent.Updated, event)
      })
  }

  query<T = Object>(sql: string, block: () => Promise<QueryResult<T>>) {
    return this.promiselikeEvent<QueryResult<T>, QueryLogEvent>(
      {
        type: LogEventType.Query,
        sql,
        state: PromiseState.Pending,
      },
      block,
    )
  }

  step<T = void>(message: string, block: () => Promise<T>) {
    return this.promiselikeEvent<T, StepLogEvent>(
      {
        type: LogEventType.Step,
        message,
        state: PromiseState.Pending,
      },
      block,
    )
  }
}
