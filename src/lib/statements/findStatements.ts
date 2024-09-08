import type { Statement } from '@/lib/statements/interface'
import { StatementExtractor } from '@/lib/statements/extractStatements'

/***
 * @deprecated
 * finds the position of all statements in a sql string,
 *  ignoring comments and whitespace
 */
export function findStatements(sql: string): Array<Statement> {
  return StatementExtractor.fromValue(sql).extract()
}
