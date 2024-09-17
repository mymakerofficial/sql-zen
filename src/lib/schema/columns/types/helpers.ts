import type {
  DataType,
  DataTypeDefinition,
  WithPseudoTypes,
} from '@/lib/schema/columns/types/base'
import { PseudoDataType } from '@/lib/schema/columns/types/base'
import type { DatabaseEngine } from '@/lib/engines/enums'
import {
  DatabaseEngineDataTypeDefinitionMap,
  PseudoDataTypeDefinition,
} from '@/lib/schema/columns/types/base'

export function isPseudoType(
  type: WithPseudoTypes<DataType>,
): type is PseudoDataType {
  return Object.values(PseudoDataType).includes(type as any)
}

export function getDataTypeDefinition(
  engine: DatabaseEngine,
  type: WithPseudoTypes<DataType>,
): DataTypeDefinition {
  if (isPseudoType(type)) {
    return PseudoDataTypeDefinition[type]
  }

  return (
    // @ts-expect-error
    DatabaseEngineDataTypeDefinitionMap[engine][type] || {
      name: type.toLowerCase(),
    }
  )
}

export function getDataTypeDisplayName(
  engine: DatabaseEngine,
  dataType: WithPseudoTypes<DataType>,
  typeName: string,
): string {
  if (dataType === PseudoDataType.Unknown) {
    return typeName
  }

  const def = getDataTypeDefinition(engine, dataType)
  return def.displayName ?? def.name
}
