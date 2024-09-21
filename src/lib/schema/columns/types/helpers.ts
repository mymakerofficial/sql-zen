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
import type { TypeDefinition } from '@/lib/schema/columns/column'

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

export function getRecursiveDDLTypeDeclaration(rootType: TypeDefinition) {
  const types = [rootType, ...getTypeDependencies(rootType).values()].reverse()

  const statements = types
    .map((it) => it.getDDLTypeDeclaration())
    .filter((it) => it !== '')

  if (statements.length === 0) {
    return ''
  }

  return `${statements.join(';\n\n')};`
}

// recursively get all types the root type depends on
export function getTypeDependencies(rootType: TypeDefinition) {
  const types = new Map<string, TypeDefinition>()

  if (rootType.keyType) {
    types.set(rootType.keyType.typeName, rootType.keyType)
  }
  if (rootType.valueType) {
    types.set(rootType.valueType.typeName, rootType.valueType)
  }

  if (rootType.fields) {
    rootType.fields.forEach((field) => {
      types.set(field.typeName, field)
    })
  }

  types.forEach((type) => {
    const innerTypes = getTypeDependencies(type)
    innerTypes.forEach((innerType) => {
      types.set(innerType.typeName, innerType)
    })
  })

  return types
}
