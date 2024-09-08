import { describe, expect, it } from 'vitest'
import { StatementExtractor } from '@/lib/statements/extractStatements'
import * as monaco from 'monaco-editor'

describe('extract statements', () => {
  describe.each([
    ['crlf', '\r\n'],
    ['lf', '\n'],
  ])('%s', (_eol, nl) => {
    const model = monaco.editor.createModel(nl, 'sql')
    const extractor = StatementExtractor.fromModel(model)

    it('should find simple statements', () => {
      model.setValue('SELECT * FROM table1; SELECT * FROM table2;')
      const statements = extractor.extract()
      expect(statements).toEqual([
        expect.objectContaining({
          sql: 'SELECT * FROM table1',
          range: {
            startLineNumber: 1,
            startColumn: 1,
            endLineNumber: 1,
            endColumn: 22,
            startIndex: 0,
            endIndex: 21,
          },
        }),
        expect.objectContaining({
          sql: 'SELECT * FROM table2',
          range: {
            startLineNumber: 1,
            startColumn: 23,
            endLineNumber: 1,
            endColumn: 44,
            startIndex: 22,
            endIndex: 43,
          },
        }),
      ])
    })

    it('should find simple statements in multiple lines', () => {
      const stmts = [
        'SELECT * FROM table1',
        'SELECT now() AS current_time',
        'SELECT id, name FROM table3',
      ]
      model.setValue(stmts.map((stmt) => `${stmt};`).join(nl))

      const statements = extractor.extract()

      expect(statements).toEqual([
        expect.objectContaining({
          sql: stmts[0],
          range: {
            startLineNumber: 1,
            startColumn: 1,
            endLineNumber: 1,
            endColumn: stmts[0].length + 2,
            startIndex: 0,
            endIndex: stmts[0].length + 1,
          },
        }),
        expect.objectContaining({
          sql: stmts[1],
          range: {
            startLineNumber: 2,
            startColumn: 1,
            endLineNumber: 2,
            endColumn: stmts[1].length + 2,
            startIndex: stmts[0].length + 1 + nl.length,
            endIndex: stmts[0].length + 1 + nl.length + stmts[1].length + 1,
          },
        }),
        expect.objectContaining({
          sql: stmts[2],
          range: {
            startLineNumber: 3,
            startColumn: 1,
            endLineNumber: 3,
            endColumn: stmts[2].length + 2,
            startIndex:
              stmts[0].length + 1 + nl.length + stmts[1].length + 1 + nl.length,
            endIndex:
              stmts[0].length +
              1 +
              nl.length +
              stmts[1].length +
              1 +
              nl.length +
              stmts[2].length +
              1,
          },
        }),
      ])
    })

    it('should find statement with single line comment', () => {
      model.setValue(
        `SELECT * FROM table1;${nl}-- hello world${nl}SELECT * FROM table2;`,
      )
      const statements = extractor.extract()
      expect(statements).toEqual([
        expect.objectContaining({
          sql: 'SELECT * FROM table1',
        }),
        expect.objectContaining({
          comment: 'hello world',
          sql: 'SELECT * FROM table2',
        }),
      ])
    })

    it('should find statement with multiple single line comments', () => {
      model.setValue(
        `SELECT * FROM table1;${nl}-- hello${nl}--  world!${nl}SELECT "hello world!";`,
      )
      const statements = extractor.extract()
      expect(statements).toEqual([
        expect.objectContaining({
          sql: 'SELECT * FROM table1',
        }),
        expect.objectContaining({
          comment: 'hello world!',
          sql: 'SELECT "hello world!"',
        }),
      ])
    })

    it('should find statement with multi line comment', () => {
      model.setValue(
        `SELECT * FROM table1;${nl}/* hello${nl} world*/SELECT * FROM table2;`,
      )
      const statements = extractor.extract()
      expect(statements).toEqual([
        expect.objectContaining({
          sql: 'SELECT * FROM table1',
        }),
        expect.objectContaining({
          comment: `hello${nl} world`,
          sql: 'SELECT * FROM table2',
        }),
      ])
    })

    it.each([
      ['single quotes', "'"],
      ['double quotes', '"'],
    ])(
      'should correctly handle semicolons in strings with %s',
      (_name, quote) => {
        model.setValue(`SELECT ${quote}hello world;${quote};${nl}SELECT 1;`)
        const statements = extractor.extract()
        expect(statements).toEqual([
          expect.objectContaining({
            sql: `SELECT ${quote}hello world;${quote}`,
          }),
          expect.objectContaining({
            sql: `SELECT 1`,
          }),
        ])
      },
    )

    it.each([
      ['single quotes', "'"],
      ['double quotes', '"'],
    ])(
      'should correctly handle escaped quotes in strings with %s',
      (_name, quote) => {
        model.setValue(
          `SELECT ${quote}foo${quote}${quote};bar${quote};${nl}SELECT 1;`,
        )
        const statements = extractor.extract()
        expect(statements).toEqual([
          expect.objectContaining({
            sql: `SELECT ${quote}foo${quote}${quote};bar${quote}`,
          }),
          expect.objectContaining({
            sql: `SELECT 1`,
          }),
        ])
      },
    )

    it('should escape postgres dollar-quoted strings', () => {
      model.setValue(`SELECT $$"hello world;"$$ AS msg;${nl}SELECT 1;`)
      const statements = extractor.extract()
      expect(statements).toEqual([
        expect.objectContaining({
          sql: `SELECT $$"hello world;"$$ AS msg`,
        }),
        expect.objectContaining({
          sql: `SELECT 1`,
        }),
      ])
    })
  })
})
