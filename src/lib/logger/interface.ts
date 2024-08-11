import { LogEventType, type PromiseState } from '@/lib/logger/enums'
import type { LoggerEventMap } from '@/lib/logger/events'
import { EventPublisher } from '@/lib/events/publisher'
import type { QueryResult } from '@/lib/queries/interface'

export type LogEventMessageData = {
  message: string
}

export type LogEventQueryData = {
  sql: string
} & (
  | {
      state: typeof PromiseState.Pending
    }
  | {
      state: typeof PromiseState.Success
      resultId: string
      rowCount: number
      affectedRows: number | null
      duration: number
    }
  | {
      state: typeof PromiseState.Error
      errorMessage: string
    }
)

export type LogEventStepData = {
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
      errorMessage: string
    }
)

type LogEventBase = {
  id: string
  when: number
}

export type LogMessageEvent = LogEventBase & {
  type: typeof LogEventType.Message
  data: LogEventMessageData
}

export type LogErrorEvent = LogEventBase & {
  type: typeof LogEventType.Error
  data: LogEventMessageData
}

export type LogQueryEvent = LogEventBase & {
  type: typeof LogEventType.Query
  data: LogEventQueryData
}

export type LogStepEvent = LogEventBase & {
  type: typeof LogEventType.Step
  data: LogEventStepData
}

export type LogEvent =
  | LogMessageEvent
  | LogErrorEvent
  | LogQueryEvent
  | LogStepEvent

export type LogEventData = LogEvent['data']
