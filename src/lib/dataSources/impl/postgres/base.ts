import { DataSource } from '@/lib/dataSources/impl/base'
import { TypeDefinition } from '@/lib/schema/columns/column'
import {
  type PGCatalogCompleteType,
  pgCatalogTypeToTypeDefinition,
} from '@/lib/schema/columns/helpers/postgresql'
import type { QueryResult } from '@/lib/queries/interface'
import { getId } from '@/lib/getId'
import {
  buildParsers,
  parsePostgresResult,
} from '@/lib/dataSources/impl/postgres/lib/parse'
import { DataSourceEvent } from '@/lib/dataSources/events'
import type { DataSourceData } from '@/lib/dataSources/types'

export type PostgresField = {
  name: string
  dataTypeID: number
}

export type PostgresQueryResult<T extends object = object> = {
  rows: T[]
  affectedRows?: number
  fields: PostgresField[]
}

class PostgresTypeManager {
  #dataSource: PostgresDataSource
  #types: Map<number, TypeDefinition> = new Map()

  #parsers: { [key: number]: (x: string, typeId?: number) => any } = {}

  constructor(dataSource: PostgresDataSource) {
    this.#dataSource = dataSource

    // temporary fix: build parsers for array types
    this.#dataSource.on(DataSourceEvent.Initialized, async () => {
      this.#parsers = await buildParsers(this.#dataSource)
    })
  }

  get dataSource() {
    return this.#dataSource
  }

  // temporary fix
  parseResult<T extends object>(result: PostgresQueryResult<T>) {
    return parsePostgresResult(result, this.#parsers)
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

    const { rows } = await this.dataSource
      .queryRaw<PGCatalogCompleteType>(
        `WITH attr AS (
    SELECT
        attrelid,
        array_agg(attname::text) AS column_names,
        array_agg(atttypid::int) AS column_typeids
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
      .then((res) => this.parseResult(res))

    for (const row of rows) {
      const typeDef = await pgCatalogTypeToTypeDefinition(row, (oids) => {
        return this.asyncGetTypes(oids)
      })
      this.#types.set(row.oid, typeDef)
    }
  }
}

export abstract class PostgresDataSource extends DataSource {
  #typeManager: PostgresTypeManager = new PostgresTypeManager(this)

  constructor(data: DataSourceData, id?: string) {
    super(data, id)

    this.on(DataSourceEvent.Initialized, async () => {
      const { rows } = await this.queryRaw<{
        version: string
        database: string
      }>('SELECT version() AS version, current_database() AS database')

      this.logger.log(`Connected to PostgreSQL version: ${rows[0].version}`)
      this.logger.log(`Current Database: ${rows[0].database}`)
    })
  }

  get types() {
    return this.#typeManager
  }

  // note: this method does not parse the result
  abstract queryRaw<T extends object = object>(
    sql: string,
  ): Promise<PostgresQueryResult<T>>

  query<T extends object = object>(sql: string): Promise<QueryResult<T>> {
    return this.logger.query(sql, async () => {
      const start = performance.now()
      const rawResponse = await this.queryRaw<T>(sql)
      const end = performance.now()

      const sysStart = performance.now()
      const parsedResponse = this.types.parseResult(rawResponse)
      const fields = await this.types.getFieldsFromResponse(parsedResponse)
      const sysEnd = performance.now()

      return {
        fields,
        rows: parsedResponse.rows,
        affectedRows: parsedResponse.affectedRows,
        duration: end - start,
        systemDuration: sysEnd - sysStart,
        id: getId('result'),
      } as QueryResult<T>
    })
  }
}
