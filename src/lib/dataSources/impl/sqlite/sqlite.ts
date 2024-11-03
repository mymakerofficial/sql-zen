import type { QueryResult } from '@/lib/queries/interface'
import { getId } from '@/lib/getId'
import { DataSource } from '@/lib/dataSources/impl/base'
import { DataSourceDriver } from '@/lib/engines/enums'
import { DataSourceMode, DataSourceStatus } from '@/lib/dataSources/enums'
import { DataSourceEvent } from '@/lib/dataSources/events'
import { invoke } from '@tauri-apps/api/core'
import { FieldDefinition } from '@/lib/schema/columns/column'
import {
  ipcQuery,
  type IpcQueryObjectResult,
  ipcQueryRowsToObjects,
} from '@/lib/dataSources/impl/ipc'

export class SQLiteDataSource extends DataSource {
  get driver() {
    return DataSourceDriver.SQLite
  }

  async init() {
    if (this.status !== DataSourceStatus.Stopped) {
      return
    }

    this.setStatus(DataSourceStatus.Pending)
    this.emit(DataSourceEvent.Initializing)

    await this.logger.step('Connecting', async () => {
      const url =
        this.mode === DataSourceMode.Memory ? ':memory:' : this.connectionString

      await invoke('connect', {
        key: this.key,
        driver: this.driver,
        url,
      }).catch((e) => {
        throw new Error(e)
      })
    })

    this.setStatus(DataSourceStatus.Running)
    this.emit(DataSourceEvent.Initialized)
  }

  async queryRaw<T extends object = object>(
    sql: string,
  ): Promise<IpcQueryObjectResult<T>> {
    const res = await ipcQuery(this.key, sql)
    return ipcQueryRowsToObjects<T>(res)
  }

  query<T extends object = object>(sql: string) {
    return this.logger.query(sql, async () => {
      const start = performance.now()
      const { rows, columns } = await this.queryRaw<T>(sql)
      const end = performance.now()

      const fields = columns.map((field) => {
        return FieldDefinition.fromSqliteNameAndType(
          field.name,
          field.dataTypeName ?? 'unknown',
        ).toFieldInfo()
      })

      return {
        fields,
        rows,
        affectedRows: null,
        duration: end - start,
        systemDuration: 0,
        id: getId('result'),
      } as QueryResult<T>
    })
  }
}
