import { DataSource } from '@/lib/dataSources/impl/base'
import { TypeDefinition } from '@/lib/schema/columns/column'
import {
  type PGCatalogCompleteType,
  pgCatalogTypeToTypeDefinition,
} from '@/lib/schema/columns/helpers/postgresql'
import type { QueryResult } from '@/lib/queries/interface'
import { getId } from '@/lib/getId'

export type PostgresQueryResult<T extends object = object> = {
  rows: T[]
  affectedRows?: number
  fields: {
    name: string
    dataTypeID: number
  }[]
}

function isString(value: unknown): value is string {
  return typeof value === 'string'
}

class PostgresTypeManager {
  #dataSource: PostgresBaseDataSource
  #types: Map<number, TypeDefinition> = new Map()

  constructor(dataSource: PostgresBaseDataSource) {
    this.#dataSource = dataSource
  }

  get dataSource() {
    return this.#dataSource
  }

  async getFieldsFromResponse(response: PostgresQueryResult<any>) {
    await this.fetchOIDs(response.fields.map((field) => field.dataTypeID))
    return response.fields.map(({ dataTypeID, name }) => {
      return this.getTypeByOID(dataTypeID).toField({ name }).toFieldInfo()
    })
  }

  // returns the TypeDefinition for the given OID
  //  be sure to call fetchOIDs first
  getTypeByOID(oid: number) {
    return this.#types.get(oid) ?? TypeDefinition.Unknown
  }

  async asyncGetTypes(oids: number[]) {
    await this.fetchOIDs(oids)
    return oids.map((oid) => this.getTypeByOID(oid))
  }

  // Fetches the type names for the given OIDs and caches them
  async fetchOIDs(oids: number[]) {
    const distinctOIDs = [...new Set(oids)]
    const missingOIDs = distinctOIDs.filter((oid) => !this.#types.has(oid))

    if (!missingOIDs.length) {
      return
    }

    let { rows } = await this.dataSource.queryRaw<PGCatalogCompleteType>(
      `WITH attr AS (
    SELECT
        attrelid,
        array_agg(attname::text) AS column_names,
        array_agg(atttypid) AS column_typeids
    FROM pg_catalog.pg_attribute
    WHERE attnum >= 1
    GROUP BY attrelid
),
enm AS (
    SELECT
        enumtypid,
        array_agg(enumlabel::text) AS enum_labels
    FROM pg_catalog.pg_enum
    GROUP BY enumtypid
)
SELECT
    oid,
    typname,
    typtype,
    typcategory,
    typrelid,
    typelem,
    attr.column_names,
    attr.column_typeids,
    enm.enum_labels
FROM pg_catalog.pg_type AS t
FULL OUTER JOIN attr
    ON attr.attrelid = t.typrelid
FULL OUTER JOIN enm
    ON enm.enumtypid = t.oid
WHERE 
    oid = ANY('{${missingOIDs.join(',')}}') 
    OR typarray = ANY('{${missingOIDs.join(',')}}')
ORDER BY typcategory = 'A'`,
    )

    // TODO: temporary fix because pg proxy doesnt deserialize arrays
    rows = rows.map((row) => {
      row.oid = Number(row.oid)
      row.typrelid = Number(row.typrelid)
      row.typelem = Number(row.typelem)

      if (isString(row.column_names)) {
        if (row.column_names.length > 0) {
          row.column_names = row.column_names
            .substring(1, row.column_names.length - 1)
            .split(',')
        } else {
          row.column_names = []
        }
      }
      if (isString(row.column_typeids)) {
        if (row.column_typeids.length > 0) {
          row.column_typeids = row.column_typeids
            .substring(1, row.column_typeids.length - 1)
            .split(',')
            .map(Number)
        } else {
          row.column_typeids = []
        }
      }
      if (isString(row.enum_labels)) {
        if (row.enum_labels.length > 0) {
          row.enum_labels = row.enum_labels
            .substring(1, row.enum_labels.length - 1)
            .split(',')
        } else {
          row.enum_labels = []
        }
      }
      return row
    })

    for (const row of rows) {
      const typeDef = await pgCatalogTypeToTypeDefinition(row, (oids) => {
        return this.asyncGetTypes(oids)
      })
      this.#types.set(row.oid, typeDef)
    }
  }
}

export abstract class PostgresBaseDataSource extends DataSource {
  #typeManager: PostgresTypeManager = new PostgresTypeManager(this)

  get types() {
    return this.#typeManager
  }

  abstract queryRaw<T extends object = object>(
    sql: string,
  ): Promise<PostgresQueryResult<T>>

  query<T extends object = object>(sql: string): Promise<QueryResult<T>> {
    return this.logger.query(sql, async () => {
      const start = performance.now()
      const rawResponse = await this.queryRaw<T>(sql)
      const end = performance.now()

      const sysStart = performance.now()
      const fields = await this.types.getFieldsFromResponse(rawResponse)
      const sysEnd = performance.now()

      return {
        fields,
        rows: rawResponse.rows,
        affectedRows: rawResponse.affectedRows,
        duration: end - start,
        systemDuration: sysEnd - sysStart,
        id: getId('result'),
      } as QueryResult<T>
    })
  }
}
