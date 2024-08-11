import { djb2 } from '@/lib/hash'
import type { DataSourceBase } from '@/lib/dataSources/types'
import { getEngineInfo } from '@/lib/engines/helpers'

export function simplifyIdentifier(identifier: string) {
  if (!identifier) {
    return 'default'
  }

  return identifier
}

export function generateDataSourceKey(info: DataSourceBase): string {
  const hash = djb2(`${info.engine}-${info.mode}-${info.identifier}`)
  return `ds_${hash}`
}

// @deprecated
export function getDataSourceEngineInfo(info: DataSourceBase) {
  return getEngineInfo(info.engine)
}

export function getDataSourceDisplayName(info: DataSourceBase): string {
  const engineInfo = getDataSourceEngineInfo(info)
  const identifier = simplifyIdentifier(info.identifier)

  if (identifier === 'default') {
    return engineInfo.name
  }

  return identifier
}
