import type { Statement } from '@/lib/statements/interface'
import { StatementExtractor } from '@/lib/statements/extractStatements'

/***
 * finds the position of all statements in a sql string,
 *  ignoring comments and whitespace
 */
export function findStatements(sql: string): Array<Statement> {
  return new StatementExtractor(sql).extract()
  // sql = sql.trimEnd()
  //
  // const statements: Array<Statement> = []
  //
  // let currentLineNumber = 1
  // let currentColumn = 0
  //
  // let statementStartLineNumber = 1
  // let statementStartColumn = 0
  // let statementStartIndex = 0
  //
  // let inStatement = false
  //
  // let index = 0
  // while (index < sql.length) {
  //   const char = sql[index]
  //
  //   if (char === '-' && sql[index + 1] === '-') {
  //     // skip to the end of the line
  //     while (sql[index] !== '\n' && sql[index] !== '\r' && index < sql.length) {
  //       index++
  //     }
  //     currentColumn = 0
  //     if (!inStatement) {
  //       statementStartLineNumber = currentLineNumber + 1
  //       statementStartColumn = currentColumn
  //       statementStartIndex = index
  //     }
  //     continue
  //   }
  //
  //   if (char === '\n' || char === '\r') {
  //     index++
  //     // skip windows newline
  //     if (sql[index - 1] === '\r' && sql[index] === '\n') {
  //       index++
  //     }
  //     currentLineNumber++
  //     currentColumn = 0
  //     if (!inStatement) {
  //       statementStartLineNumber = currentLineNumber
  //       statementStartColumn = currentColumn
  //       statementStartIndex = index
  //     }
  //     continue
  //   }
  //
  //   if (char === ' ') {
  //     index++
  //     currentColumn++
  //     if (!inStatement) {
  //       statementStartLineNumber = currentLineNumber
  //       statementStartColumn = currentColumn + 1
  //       statementStartIndex = index + 1
  //     }
  //     continue
  //   }
  //
  //   inStatement = true
  //
  //   if (char === ';' || index === sql.length - 1) {
  //     if (char !== ';') {
  //       // last statement doesnt have a semicolon so go forward one char
  //       index++
  //       currentColumn++
  //     }
  //     const subString = sql.slice(statementStartIndex - 1, index).trim()
  //     index++
  //     currentColumn++
  //     if (subString.length > 0) {
  //       const range = {
  //         startLineNumber: statementStartLineNumber,
  //         startColumn: statementStartColumn,
  //         startIndex: statementStartIndex,
  //         endLineNumber: currentLineNumber,
  //         // +1 to include the semicolon
  //         endColumn: currentColumn + 1,
  //         endIndex: index + 1,
  //       }
  //       statements.push({
  //         range,
  //         sql: subString,
  //         key: getStatementKey(subString, range),
  //       })
  //     }
  //     statementStartLineNumber = currentLineNumber
  //     statementStartColumn = currentColumn + 1
  //     statementStartIndex = index + 1
  //     inStatement = false
  //   } else {
  //     index++
  //     currentColumn++
  //   }
  // }
  //
  // return statements
}
