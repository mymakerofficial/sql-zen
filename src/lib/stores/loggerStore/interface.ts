import type { LogEventType, PromiseState } from '@/lib/logger/enums'

export type LoggerStoreEntry = {
  loggerId: string
  eventId: string
  type: LogEventType
  when: number
  // message or sql
  message: string
  errorMessage: string | null
  state: PromiseState | null
  resultId: string | null
  rowCount: number | null
  affectedRows: number | null
  duration: number | null
}

export interface ILoggerStore {
  create(entry: LoggerStoreEntry): void
  update(
    loggerId: string,
    eventId: string,
    data: Partial<LoggerStoreEntry>,
  ): void
  getAllFromLogger(dataStoreKey: string): Array<LoggerStoreEntry>
}
