import { djb2 } from '@/lib/hash'
import type { DataSourceDescriptor } from '@/lib/dataSources/interface'
import { getEngineInfo } from '@/lib/engines/helpers'

export function simplifyIdentifier(identifier: string | null) {
  if (!identifier) {
    return null
  }

  if (identifier === 'null') {
    return null
  }

  if (identifier === 'database') {
    return null
  }

  if (identifier === 'identifier') {
    return null
  }

  if (identifier === 'default') {
    return null
  }

  return identifier
}

export function generateDataSourceKey(desc: DataSourceDescriptor): string {
  const hash = djb2(`${desc.engine}-${desc.mode}-${desc.identifier}`)
  return `ds_${hash}`
}

export function getDataSourceEngineInfo(desc: DataSourceDescriptor) {
  return getEngineInfo(desc.engine)
}

export function getDataSourceDisplayName(desc: DataSourceDescriptor): string {
  const info = getDataSourceEngineInfo(desc)
  const identifier = simplifyIdentifier(desc.identifier)

  return identifier ?? info.name
}
