import { TypeDefinition } from '@/lib/schema/columns/column'
import type { WithPseudoTypes } from '@/lib/schema/columns/types/base'
import { PseudoDataType } from '@/lib/schema/columns/types/base'
import {
  PostgresDataType,
  PostgresUDTNameDataTypeMap,
} from '@/lib/schema/columns/types/postgresql'

export const PGTypeType = {
  Base: 'b',
  Composite: 'c',
  Domain: 'd',
  Enum: 'e',
  Pseudo: 'p',
  Range: 'r',
  MultiRange: 'r',
} as const
export type PGTypeType = (typeof PGTypeType)[keyof typeof PGTypeType]

export const PGTypeCategory = {
  Array: 'A',
  Boolean: 'B',
  Composite: 'C',
  DateTime: 'D',
  Enum: 'E',
  Geometric: 'G',
  NetworkAddress: 'I',
  Numeric: 'N',
  Pseudo: 'P',
  Range: 'R',
  String: 'S',
  Timespan: 'T',
  UserDefined: 'U',
  BitString: 'V',
  Unknown: 'X',
  InternalUse: 'Z',
} as const
export type PGTypeCategory =
  (typeof PGTypeCategory)[keyof typeof PGTypeCategory]

export type PGCatalogPGType = {
  oid: number
  typname: string
  typtype: PGTypeType
  typcategory: PGTypeCategory
  // when composite type, oid of pg_class that defines the table
  typrelid: number
  // oid of pg_type that defines the array type
  typarray: number
  // when array type, oid of pg_type that defines the element type
  typelem: number
}

export type PGCatalogCompleteType = Omit<PGCatalogPGType, 'typarray'> & {
  column_names: string[]
  column_typeids: number[]
  enum_labels: string[]
}

export function pgUdtNameToDataType(
  udtName: string,
): WithPseudoTypes<PostgresDataType> {
  // @ts-expect-error
  const dataType = PostgresUDTNameDataTypeMap[udtName.toLowerCase()]

  if (!dataType) {
    console.warn(`Unknown PostgreSQL data type: ${udtName}`)
    return PseudoDataType.Unknown
  }

  return dataType
}

export async function pgCatalogTypeToTypeDefinition(
  type: PGCatalogCompleteType,
  getTypes: (oids: number[]) => Promise<TypeDefinition[]>,
): Promise<TypeDefinition> {
  switch (type.typcategory) {
    case PGTypeCategory.Array: {
      const [valueType] = await getTypes([type.typelem])

      return TypeDefinition.createPostgresType({
        dataType: PostgresDataType.Array,
        typeName: type.typname,
        valueType,
      })
    }
    case PGTypeCategory.Composite: {
      const fieldTypes = await getTypes(type.column_typeids)
      const fields = fieldTypes.map((def, index) => {
        return def.toField({ name: type.column_names[index] })
      })

      return TypeDefinition.createPostgresType({
        dataType: PostgresDataType.Composite,
        typeName: type.typname,
        fields,
      })
    }
    default: {
      return TypeDefinition.createPostgresType({
        dataType: pgUdtNameToDataType(type.typname),
        typeName: type.typname,
      })
    }
  }
}
