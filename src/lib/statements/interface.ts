export type Position = {
  lineNumber: number
  column: number
}

export type Range = {
  startLineNumber: number
  startColumn: number
  endLineNumber: number
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
