import type {
  PostgresField,
  PostgresQueryResult,
} from '@/lib/dataSources/impl/postgres/base'
import { types } from '@electric-sql/pglite'
import { PostgresDataSource } from '@/lib/dataSources/impl/postgres/base'

/***
 * TODO: this is a temporary solution
 * in the future parsers should be included in the query result,
 *  but this would require a complete rewrite of query results
 */
export function parsePostgresResult<T extends object = object>(
  originalResult: PostgresQueryResult<T>,
  parsers?: { [key: number]: (x: string, typeId?: number) => any },
): PostgresQueryResult<T> {
  const fieldsMap = new Map<string, PostgresField>()
  originalResult.fields.forEach((field) => {
    fieldsMap.set(field.name, field)
  })

  // postgres only returns strings
  const originalRows = originalResult.rows as Record<string, string | null>[]

  const rows = originalRows.map((row) => {
    Object.keys(row).forEach((key) => {
      const value = row[key]
      const type = fieldsMap.get(key)?.dataTypeID
      if (type) {
        row[key] = types.parseType(value, type, parsers)
      }
    })
    return row as T
  })

  return {
    ...originalResult,
    rows,
  }
}

/***
 * TODO: this is a temporary solution
 * in the future parsers should be included in the query result,
 *  but this would require a complete rewrite of query results
 */
export async function buildParsers(dataSource: PostgresDataSource) {
  const parsers = { ...types.parsers }

  const { rows: arrayTypes } = await dataSource
    .queryRaw<{ oid: number; typarray: number }>(
      `
      SELECT b.oid, b.typarray
      FROM pg_catalog.pg_type AS a
      LEFT JOIN pg_catalog.pg_type AS b 
          ON b.oid = a.typelem
      WHERE a.typcategory = 'A'
      GROUP BY b.oid, b.typarray
      ORDER BY b.oid
    `,
    )
    .then(parsePostgresResult)

  for (const type of arrayTypes) {
    parsers[type.typarray] = (x) =>
      types.arrayParser(x, parsers[type.oid], type.typarray)
  }

  return parsers
}
