import type { Table } from 'apache-arrow'

export function arrowToResultArray(arrowResult: Table): Array<Object> {
  return arrowResult.toArray().map((row) => {
    return row.toJSON()
  })
}