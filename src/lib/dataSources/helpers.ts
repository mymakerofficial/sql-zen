import { djb2 } from '@/lib/hash'
import type { DataSourceDescriptor } from '@/lib/dataSources/interface'

export function generateDataSourceKey(info: DataSourceDescriptor): string {
  const hash = djb2(`${info.engine}-${info.mode}-${info.identifier}`)
  return `ds_${hash}`
}
