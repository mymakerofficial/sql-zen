export type QueryResult = Array<Object>

export type DatabaseFacade = {
  init: () => Promise<void>
  query: (sql: string) => Promise<QueryResult>
  close: () => Promise<void>
}
