export type Position = {
  // 1 based
  lineNumber: number
  // 1 based
  column: number
}

export type Range = {
  // 1 based
  startLineNumber: number
  // 1 based
  startColumn: number
  // 1 based
  endLineNumber: number
  // 1 based
  endColumn: number
}

export type StatementRange = Range & {
  startIndex: number
  endIndex: number
}

/***
 * Describes an SQL statement
 */
export type Statement = {
  // The SQL statement, trimmed and without semicolon
  sql: string
  // A comment that was found before the statement, or provided in any other way
  comment?: string
  // If the statement was found in a larger SQL string,
  //  this is the range of the statement including the semicolon if present
  range?: StatementRange
  // A hash of the statement, used for caching
  key: string
}
