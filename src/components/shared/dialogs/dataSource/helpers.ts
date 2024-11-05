import { DatabaseEngine } from '@/lib/engines/enums'

const adjectives = [
  'awesome',
  'great',
  'amazing',
  'fantastic',
  'wonderful',
  'incredible',
]

const nouns = [
  'squirrel',
  'bean',
  'database',
  'duck',
  'elephant',
  'penguin',
  'whale',
]

const databases = {
  [DatabaseEngine.None]: 'nothing',
  [DatabaseEngine.PostgreSQL]: 'postgres',
  [DatabaseEngine.SQLite]: 'sqlite',
  [DatabaseEngine.MySQL]: 'mysql',
  [DatabaseEngine.MariaDB]: 'mariadb',
  [DatabaseEngine.DuckDB]: 'duckdb',
} as const satisfies Record<DatabaseEngine, string>

export function getIdentifier(engine: DatabaseEngine): string {
  const randomAdjective =
    adjectives[Math.floor(Math.random() * adjectives.length)]
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)]

  return `${randomAdjective}-${databases[engine]}-${randomNoun}`
}
