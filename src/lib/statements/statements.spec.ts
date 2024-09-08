import { describe, it, expect } from 'vitest'
import { findStatements } from '@/lib/statements/findStatements'

describe('statements', () => {
  it('should find simple statements', () => {
    const sql = 'SELECT * FROM table1; SELECT * FROM table2;'
    const statements = findStatements(sql)
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
    const sql = 'SELECT * FROM table1;\nSELECT * FROM table2;'
    const statements = findStatements(sql)
    expect(statements).toEqual([
      expect.objectContaining({
        sql: 'SELECT * FROM table1',
      }),
      expect.objectContaining({
        sql: 'SELECT * FROM table2',
      }),
    ])
  })
})
