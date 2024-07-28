import type { LoggerStoreEntry } from '@/lib/stores/loggerStore/interface'
import type {
  LogEvent,
  LogEventData,
  LogEventQueryData,
  LogEventStepData,
} from '@/lib/logger/interface'
import { LogEventType, PromiseState } from '@/lib/logger/enums'

export function logEventToLoggerStoreEntry(
  event: LogEvent,
  dataStoreKey: string,
): LoggerStoreEntry {
  return {
    eventId: event.id,
    loggerId: dataStoreKey,
    type: event.type,
    when: event.when,
    // @ts-expect-error
    message: event.data.message ?? event.data.sql,
    // @ts-expect-error
    errorMessage: event.data.errorMessage ?? null,
    // @ts-expect-error
    state: event.data.state ?? null,
    // @ts-expect-error
    resultId: event.data.resultId ?? null,
    // @ts-expect-error
    rowCount: event.data.rowCount ?? null,
    // @ts-expect-error
    affectedRows: event.data.affectedRows ?? null,
    // @ts-expect-error
    duration: event.data.duration ?? null,
  }
}

export function logEventDataUpdateToStoreEntryUpdate(
  partial: Partial<LogEventData>,
): Partial<LoggerStoreEntry> {
  const data = { ...partial }
  // @ts-expect-error
  if (data.message || data.sql) {
    // @ts-expect-error
    data.message = data.message ?? data.sql
  }
  return data
}

export function loggerStoreEntryToLogEvent(entry: LoggerStoreEntry): LogEvent {
  if (entry.type === LogEventType.Message) {
    return {
      type: LogEventType.Message,
      id: entry.eventId,
      when: entry.when,
      data: {
        message: entry.message,
      },
    }
  } else if (entry.type === LogEventType.Error) {
    return {
      type: LogEventType.Error,
      id: entry.eventId,
      when: entry.when,
      data: {
        message: entry.message,
      },
    }
  } else if (entry.type === LogEventType.Query) {
    let data: LogEventQueryData
    if (entry.state === PromiseState.Pending) {
      data = {
        sql: entry.message,
        state: PromiseState.Pending,
      }
    } else if (entry.state === PromiseState.Success) {
      data = {
        sql: entry.message,
        state: PromiseState.Success,
        resultId: entry.resultId!,
        rowCount: entry.rowCount!,
        affectedRows: entry.affectedRows,
        duration: entry.duration!,
      }
    } else if (entry.state === PromiseState.Error) {
      data = {
        sql: entry.message,
        state: PromiseState.Error,
        errorMessage: entry.errorMessage!,
      }
    } else {
      throw new Error('Invalid query state')
    }

    return {
      type: LogEventType.Query,
      id: entry.eventId,
      when: entry.when,
      data,
    }
  } else if (entry.type === LogEventType.Step) {
    let data: LogEventStepData
    if (entry.state === PromiseState.Pending) {
      data = {
        message: entry.message,
        state: PromiseState.Pending,
      }
    } else if (entry.state === PromiseState.Success) {
      data = {
        message: entry.message,
        state: PromiseState.Success,
      }
    } else if (entry.state === PromiseState.Error) {
      data = {
        message: entry.message,
        state: PromiseState.Error,
        errorMessage: entry.errorMessage!,
      }
    } else {
      throw new Error('Invalid step state')
    }

    return {
      type: LogEventType.Step,
      id: entry.eventId,
      when: entry.when,
      data,
    }
  } else {
    throw new Error('Invalid log entry type')
  }
}
