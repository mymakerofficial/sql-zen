import { invoke } from '@tauri-apps/api/core'

export type IpcColumn = {
  name: string
  dataTypeID: number | null
  dataTypeName: string | null
}

export type IpcCellValue = string | number | null

export type IpcQueryResult = {
  columns: IpcColumn[]
  rows: IpcCellValue[][]
}

export type IpcQueryObjectResult<T extends object = object> = {
  columns: IpcColumn[]
  rows: T[]
}

export async function ipcQuery(key: string, sql: string) {
  return invoke<IpcQueryResult>('query', {
    key,
    sql,
  }).catch((e) => {
    throw new Error(e)
  })
}

export function ipcQueryRowsToObjects<T extends object = object>(
  res: IpcQueryResult,
): IpcQueryObjectResult<T> {
  const rows = res.rows.map((row) => {
    const obj: Record<string, IpcCellValue> = {}
    res.columns.forEach((field, i) => {
      obj[field.name] = row[i]
    })
    return obj as T
  })

  return {
    rows,
    columns: res.columns,
  }
}
