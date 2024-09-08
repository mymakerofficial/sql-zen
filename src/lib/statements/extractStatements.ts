import type {
  Position,
  Statement,
  StatementRange,
} from '@/lib/statements/interface'
import { getStatementKey } from '@/lib/statements/helpers'

export class StatementExtractor {
  #original: string
  #statements: Statement[] = []
  // map of comment end line number to comment
  #comments: Map<number, string> = new Map()

  #index = 0

  #lineFeedIndices: number[] = []

  constructor(original: string) {
    this.#original = original
  }

  // prepares the line feed indices
  #prepare() {
    this.#lineFeedIndices = []
    for (let i = 0; i < this.#original.length; i++) {
      if (this.#original[i] === '\n') {
        this.#lineFeedIndices.push(i)
      }
    }
  }

  // gets the line number and column of a character index
  //  column is -1 if the character is a line break
  #getPosition(index: number): Position {
    let previousLineBreakIndex = -1

    for (let i = 0; i < this.#lineFeedIndices.length; i++) {
      if (this.#lineFeedIndices[i] > index) {
        break
      }
      previousLineBreakIndex = i
    }

    return {
      lineNumber: previousLineBreakIndex + 2,
      column:
        index -
        (previousLineBreakIndex !== -1
          ? this.#lineFeedIndices[previousLineBreakIndex] + 1 // to skip the line break
          : 0),
    }
  }

  #getRange(startIndex: number, endIndex: number): StatementRange {
    const start = this.#getPosition(startIndex)
    const end = this.#getPosition(endIndex)

    return {
      startLineNumber: start.lineNumber,
      startColumn: start.column,
      endLineNumber: end.lineNumber,
      endColumn: end.column,
      startIndex,
      endIndex,
    }
  }

  #next(): string {
    return this.#original[this.#index++]
  }

  #get(): string {
    return this.#original[this.#index]
  }

  #peek(): string {
    return this.#original[this.#index + 1]
  }

  #hasRemaining(): boolean {
    return this.#index < this.#original.length
  }

  #scan() {
    while (this.#hasRemaining()) {
      const char = this.#get()

      if (char === ' ' || char === '\t' || char === '\n' || char === '\r') {
        this.#next()
        continue
      }

      if (char === '-' && this.#peek() === '-') {
        this.#scanSingleLineComment()
        continue
      }

      if (char === '/' && this.#peek() === '*') {
        this.#scanMultiLineComment()
        continue
      }

      // found statement
      this.#scanStatement()
    }
  }

  #getComment(range: StatementRange): string | undefined {
    return (
      this.#comments.get(range.startLineNumber - 1) ||
      this.#comments.get(range.startLineNumber)
    )
  }

  #scanSingleLineComment() {
    const start = this.#index
    while (this.#hasRemaining()) {
      const char = this.#next()
      if (char === '\n') {
        break
      }
    }

    const comment = this.#original
      .slice(
        start + 2, // +2 to skip the --
        this.#index - 1,
      )
      .trim()
    const { lineNumber } = this.#getPosition(this.#index - 2) // -2 to move before the line break
    console.log('found single line comment:', comment, lineNumber)
    this.#comments.set(lineNumber, comment)
  }

  #scanMultiLineComment() {
    const start = this.#index
    while (this.#hasRemaining()) {
      const char = this.#next()
      if (char === '*' && this.#next() === '/') {
        break
      }
    }

    const comment = this.#original
      .slice(
        start + 2, // +2 to skip the /*
        this.#index - 2,
      )
      .trim()
    const { lineNumber } = this.#getPosition(this.#index - 2) // -2 to move before the line break
    console.log('found multi line comment:', comment, lineNumber)
    this.#comments.set(lineNumber, comment)
  }

  #scanStatement() {
    const start = this.#index
    let endsWithSemicolon = false
    while (this.#hasRemaining()) {
      const char = this.#next()

      if (char === "'" || char === '"') {
        this.#escapeString(char)
      }

      if (char === '$' && this.#get() === '$') {
        this.#escapeDollarQuote()
      }

      if (char === ';') {
        endsWithSemicolon = true
        break
      }
    }

    const sql = this.#original
      .slice(start, this.#index - (endsWithSemicolon ? 1 : 0))
      .trim()
    const range = this.#getRange(start, this.#index)
    console.log('found statement:', sql, range)
    this.#statements.push({
      sql,
      comment: this.#getComment(range),
      range,
      key: getStatementKey(sql, range),
    })
  }

  #escapeString(quote: string) {
    while (this.#hasRemaining()) {
      const char = this.#next()
      if (char === quote && this.#peek() !== quote) {
        break
      }
    }
  }

  #escapeDollarQuote() {
    while (this.#hasRemaining()) {
      const char = this.#next()
      if (char === '$' && this.#next() === '$') {
        break
      }
    }
  }

  extract(): Statement[] {
    this.#prepare()

    this.#scan()

    console.log('comments:', this.#comments)
    console.log('statements:', this.#statements)

    return this.#statements
  }
}
