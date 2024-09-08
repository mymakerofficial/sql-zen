import { describe, expect, it } from 'vitest'
import { StatementExtractor } from '@/lib/statements/extractStatements'

describe('extract statements', () => {
  describe.each([
    ['crlf', '\r\n'],
    ['lf', '\n'],
  ])('with new line mode %s', (_nlname, nl) => {
    it('should find simple statements', () => {
      const sql = 'SELECT * FROM table1; SELECT * FROM table2;'
      const statements = new StatementExtractor(sql).extract()
      expect(statements).toEqual([
        expect.objectContaining({
          sql: 'SELECT * FROM table1',
        }),
        expect.objectContaining({
          sql: 'SELECT * FROM table2',
        }),
      ])
    })

    it('should find simple statements in multiple lines', () => {
      const sql = `SELECT * FROM table1;${nl}SELECT * FROM table2;${nl}SELECT * FROM table3;`
      const statements = new StatementExtractor(sql).extract()
      expect(statements).toEqual([
        expect.objectContaining({
          sql: 'SELECT * FROM table1',
        }),
        expect.objectContaining({
          sql: 'SELECT * FROM table2',
        }),
        expect.objectContaining({
          sql: 'SELECT * FROM table3',
        }),
      ])
    })

    it('should find statement with single line comment', () => {
      const sql = `SELECT * FROM table1;${nl}-- hello world${nl}SELECT * FROM table2;`
      const statements = new StatementExtractor(sql).extract()
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

    it('should find statement with multi line comment', () => {
      const sql = `SELECT * FROM table1;${nl}/* hello${nl} world*/SELECT * FROM table2;`
      const statements = new StatementExtractor(sql).extract()
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
        const sql = `SELECT ${quote}hello world;${quote};${nl}SELECT 1;`
        const statements = new StatementExtractor(sql).extract()
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
        const sql = `SELECT ${quote}foo${quote}${quote};bar${quote};${nl}SELECT 1;`
        const statements = new StatementExtractor(sql).extract()
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
      const sql = `SELECT $$"hello world;"$$ AS msg;${nl}SELECT 1;`
      const statements = new StatementExtractor(sql).extract()
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
