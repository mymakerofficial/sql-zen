/***
 * separates a string of sql queries into an array of individual queries,
 *  removing comments and empty queries
 */
export function separateQueries(sql: string) {
  return sql
    .replace(/--.*/g, '')
    .split(';')
    .map((query) => query.trim())
    .filter((query) => query.length > 0)
}
