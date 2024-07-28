import postgresExample from './postgres.sql?raw'
import sqliteExample from './sqlite.sql?raw'
import duckdbExample from './duckdb'
import { DatabaseEngine } from '@/lib/engines/enums'

export function getExampleSql(engine: DatabaseEngine) {
  if (engine === DatabaseEngine.PostgreSQL) {
    return postgresExample
  } else if (engine === DatabaseEngine.SQLite) {
    return sqliteExample
  } else if (engine === DatabaseEngine.DuckDB) {
    return duckdbExample
  } else {
    return 'SELECT 1;'
  }
}
