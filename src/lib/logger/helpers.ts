import type { LogEvent } from '@/lib/logger/interface'
import { getId } from '@/lib/getId'

export function createLogEvent(
  partial: Omit<LogEvent, 'id' | 'when'>,
): LogEvent {
  return {
    id: getId('log'),
    when: Date.now(),
    ...partial,
  } as LogEvent
}
