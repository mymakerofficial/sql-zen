import type { Position, Range } from '@/lib/statements/interface'

export function positionInsideRange(position: Position, range: Range) {
  if (range.startLineNumber === range.endLineNumber) {
    return (
      range.startLineNumber === position.lineNumber &&
      range.startColumn <= position.column &&
      range.endColumn >= position.column
    )
  } else {
    if (range.startLineNumber === position.lineNumber) {
      return range.startColumn <= position.column
    }
    if (range.endLineNumber === position.lineNumber) {
      return range.endColumn >= position.column
    }
    return (
      range.startLineNumber < position.lineNumber &&
      range.endLineNumber > position.lineNumber
    )
  }
}

/***
 * Returns true if start or end of `a` is touching `b`, or `a` is inside `b` or vice versa
 */
export function rangesTouch(a: Range, b: Range) {
  return (
    positionInsideRange(
      { lineNumber: a.startLineNumber, column: a.startColumn },
      b,
    ) ||
    positionInsideRange(
      { lineNumber: a.endLineNumber, column: a.endColumn },
      b,
    ) ||
    positionInsideRange(
      { lineNumber: b.startLineNumber, column: b.startColumn },
      a,
    ) ||
    positionInsideRange({ lineNumber: b.endLineNumber, column: b.endColumn }, a)
  )
}

/***
 * Returns true if `range` is around or after `position`
 */
export function rangeIsAfterPosition(range: Range, position: Position) {
  return (
    positionInsideRange(position, range) ||
    range.startLineNumber > position.lineNumber ||
    (range.startLineNumber === position.lineNumber &&
      range.startColumn > position.column)
  )
}
