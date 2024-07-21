export class DatabaseNotLoadedError extends Error {
  constructor(message?: string) {
    super(message ?? 'Database not loaded')
    this.name = 'DatabaseNotLoadedError'
  }
}
