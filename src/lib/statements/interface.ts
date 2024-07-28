export type StatementRange = {
  // 1-indexed
  startLineNumber: number
  startColumn: number
  // 1-indexed
  endLineNumber: number
  endColumn: number
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
