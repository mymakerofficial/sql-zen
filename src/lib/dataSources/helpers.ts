import { djb2 } from '@/lib/hash'
import type { DataSourceBase } from '@/lib/dataSources/types'
import { getEngineInfo } from '@/lib/engines/helpers'
import type { DataSourceMode } from '@/lib/dataSources/enums'
import {
  type DataSourceModeInfo,
  dataSourceModesMap,
} from '@/lib/dataSources/constants'

// @deprecated
export function simplifyIdentifier(identifier: string) {
  if (!identifier) {
    return 'default'
  }

  return identifier
}

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
