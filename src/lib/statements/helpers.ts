import type { StatementRange } from '@/lib/statements/interface'
import { djb2 } from '@/lib/hash'

export function getStatementKey(sql: string, range: StatementRange): string {
  const hash = djb2(
    `${sql}-${range.startLineNumber}-${range.startColumn}-${range.endLineNumber}-${range.endColumn}`,
  )
  return `stmt_${hash}`
}
