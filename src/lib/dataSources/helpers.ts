import type { DataSourceBase } from '@/lib/dataSources/types'
import { getEngineInfo } from '@/lib/engines/helpers'
import type { DataSourceMode } from '@/lib/dataSources/enums'
import {
  type DataSourceModeInfo,
  dataSourceModesMap,
} from '@/lib/dataSources/constants'
import { djb2 } from '@/lib/hash'

// @deprecated
export function simplifyIdentifier(identifier: string) {
  if (!identifier) {
    return 'default'
  }

  return identifier
}

// @deprecated data sources are no longer identified by a key
//  instead a unique id is used.
//  This change was made to allow changing data source properties without effecting the key.
//  This function is kept for backward compatibility.
export function generateDataSourceKey(info: DataSourceBase): string {
  const hash = djb2(
    [
      info.engine,
      info.driver,
      info.mode,
      info.displayName,
      info.identifier,
      info.connectionString,
    ].join(':'),
  )
  return `ds_${hash}`
}

// @deprecated
export function getDataSourceEngineInfo(info: DataSourceBase) {
  return getEngineInfo(info.engine)
}

// @deprecated
export function getDataSourceDisplayName(info: DataSourceBase): string {
  const engineInfo = getDataSourceEngineInfo(info)

  return engineInfo.name
}

export function getDataSourceModeInfo(mode: DataSourceMode) {
  return { mode, ...dataSourceModesMap[mode] } as DataSourceModeInfo
}
