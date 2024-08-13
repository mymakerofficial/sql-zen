import postgresExample from './postgres.sql?raw'
import sqliteExample from './sqlite.sql?raw'
import duckdbExample from './duckdb'
import { DatabaseEngine } from '@/lib/engines/enums'

export function getExampleSql(engine: DatabaseEngine) {
  if (engine === DatabaseEngine.PostgreSQL) {
    return prependBanner(postgresExample)
  } else if (engine === DatabaseEngine.SQLite) {
    return prependBanner(sqliteExample)
  } else if (engine === DatabaseEngine.DuckDB) {
    return prependBanner(duckdbExample)
  } else {
    return prependBanner('SELECT 1;')
  }
}

function prependBanner(sql: string) {
  return `
${sql}`
}
