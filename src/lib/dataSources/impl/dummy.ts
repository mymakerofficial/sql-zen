import type { QueryResult } from '@/lib/queries/interface'
import { FileAccessor } from '@/lib/files/fileAccessor'
import { getId } from '@/lib/getId'
import { DataSource } from '@/lib/dataSources/impl/base'

export class DataSourceDummy extends DataSource {
  isInitialized(): boolean {
    return true
  }

  init() {
    return this.logger.step('Initializing dummy data source', async () => {})
  }

  query<T extends object = object>(sql: string) {
    return this.logger.query(sql, async () => {
      return {
        rows: [],
        affectedRows: null,
        duration: 0,
        id: getId('result'),
      } as QueryResult<T>
    })
  }

  async dump() {
    return FileAccessor.Dummy
  }

  async close() {
    return
  }
}
