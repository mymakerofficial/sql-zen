export type Position = {
  // 1 based
  lineNumber: number
  // 0 based
  column: number
}

export type Range = {
  // 1 based
  startLineNumber: number
  // 0 based
  startColumn: number
  // 1 based
  endLineNumber: number
  // 0 based
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
  sql: string
  // A comment that was found before the statement, or provided in any other way
  comment?: string
  // If the statement was found in a larger SQL string, this is the range of the statement
  range?: StatementRange
  // A hash of the statement, used for caching
  key: string
}
