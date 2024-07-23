import { DatabaseEngine } from '@/lib/databaseEngines'
import postgresExample from './postgres.sql?raw'
import sqliteExample from './sqlite.sql?raw'
import duckdbExample from './duckdb'

export function getExampleSql(engine: DatabaseEngine) {
  if (engine === DatabaseEngine.PostgreSQL) {
    return postgresExample
  } else if (engine === DatabaseEngine.SQLite) {
    return sqliteExample
  } else if (engine === DatabaseEngine.DuckDB) {
    return duckdbExample
  } else {
    throw new Error(`Unknown database engine: ${engine}`)
  }
}
