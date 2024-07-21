export type FoundStatement = {
  startLineNumber: number
  startColumn: number
  endLineNumber: number
  endColumn: number
  startIndex: number
  endIndex: number
  sql: string
}

/***
 * finds the position of all statements in a sql string,
 *  ignoring comments and whitespace
 */
export function findStatements(sql: string): Array<FoundStatement> {
  const statements: Array<FoundStatement> = []

  let currentLineNumber = 1
  let currentColumn = 0

  let statementStartLineNumber = 1
  let statementStartColumn = 0
  let statementStartIndex = 0

  let inStatement = false

  for (let index = 0; index < sql.length; index++) {
    const char = sql[index]

    if (char === '-' && sql[index + 1] === '-') {
      // skip to the end of the line
      while (sql[index] !== '\n' && sql[index] !== '\r' && index < sql.length) {
        index++
      }
      currentLineNumber++
      currentColumn = 0
      if (!inStatement) {
        statementStartLineNumber = currentLineNumber
        statementStartColumn = currentColumn
        statementStartIndex = index
      }
      continue
    }

    if (char === '\n' || char === '\r') {
      index++
      if (sql[index] === '\n' || sql[index] === '\n') {
        index++
      }
      currentLineNumber++
      currentColumn = 0
      continue
    }

    inStatement = true

    if (char === ';' || index === sql.length - 1) {
      const statement = sql.slice(statementStartIndex, index).trim()
      if (statement.length > 0) {
        statements.push({
          startLineNumber: statementStartLineNumber,
          startColumn: statementStartColumn,
          startIndex: statementStartIndex,
          endLineNumber: currentLineNumber,
          endColumn: currentColumn,
          endIndex: index,
          sql: statement,
        })
      }
      statementStartLineNumber = currentLineNumber
      statementStartColumn = currentColumn + 1
      statementStartIndex = index + 1
      inStatement = false
    }
  }

  return statements
}
