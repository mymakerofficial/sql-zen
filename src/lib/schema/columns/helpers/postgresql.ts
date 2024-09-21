import { TypeDefinition } from '@/lib/schema/columns/column'
import type { WithPseudoTypes } from '@/lib/schema/columns/types/base'
import { PostgresDataType } from '@/lib/schema/columns/types/postgresql'
import { PostgresUDTNameDataTypeMap } from '@/lib/schema/columns/types/postgresql'
import { PseudoDataType } from '@/lib/schema/columns/types/base'

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

export function pgCatalogTypeToTypeDefinition(
  type: PGCatalogPGType,
  existingTypes: Map<number, TypeDefinition>,
): TypeDefinition {
  if (type.typcategory === PGTypeCategory.Array) {
    // get the element type
    //  this relies on the fact, that postgres returns the element type first
    const valueType = existingTypes.get(type.typelem) ?? TypeDefinition.Unknown

    return TypeDefinition.createPostgresType({
      dataType: PostgresDataType.Array,
      typeName: type.typname,
      valueType,
    })
  }

  return TypeDefinition.createPostgresType({
    dataType: pgUdtNameToDataType(type.typname),
    typeName: type.typname,
  })
}
