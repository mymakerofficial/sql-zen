import type { Statement, StatementRange } from '@/lib/statements/interface'
import { getStatementKey } from '@/lib/statements/helpers'
import * as monaco from 'monaco-editor'

export class StatementExtractor {
  #model: monaco.editor.ITextModel
  // copy of the model value
  #value: string = ''
  #statements: Statement[] = []
  // map of comment end line number to comment
  #comments: Map<number, string> = new Map()

  #index = 0

  constructor(model: monaco.editor.ITextModel) {
    this.#model = model
  }

  static fromModel(model: monaco.editor.ITextModel) {
    return new StatementExtractor(model)
  }

  static fromValue(value: string) {
    const model = monaco.editor.createModel(value, 'sql')
    return new StatementExtractor(model)
  }

  #getPosition(index: number) {
    return this.#model.getPositionAt(index)
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
    return this.#value[this.#index++]
  }

  #get(): string {
    return this.#value[this.#index]
  }

  #peek(): string {
    return this.#value[this.#index + 1]
  }

  #hasRemaining(): boolean {
    return this.#index < this.#value.length
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

    const comment = this.#value
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

    const comment = this.#value
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

    const sql = this.#value
      .slice(start, this.#index - (endsWithSemicolon ? 1 : 0))
      .trimStart()
    const range = this.#getRange(start, this.#index)
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
    this.#value = this.#model.getValue()
    this.#index = 0
    this.#statements = []
    this.#comments.clear()

    this.#scan()

    console.log('comments:', this.#comments)
    console.log('statements:', this.#statements)

    return this.#statements
  }
}
