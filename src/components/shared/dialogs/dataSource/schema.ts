import {
  DatabaseEngine,
  DataSourceDriver,
  DataSourceDriverCapability,
} from '@/lib/engines/enums'
import * as z from 'zod'
import { DataSourceMode } from '@/lib/dataSources/enums'
import { FileAccessor } from '@/lib/files/fileAccessor'
import { getDriverCapability } from '@/lib/engines/helpers'

export const dataSourceSchema = z
  .object({
    engine: z.nativeEnum(DatabaseEngine),
    mode: z.nativeEnum(DataSourceMode),
    driver: z.nativeEnum(DataSourceDriver),
    displayName: z
      .string()
      .min(
        1,
        'A display name is required, otherwise how are you gonna tell which data source is which?',
      )
      .max(64, 'Display names must be 64 characters or less.'),
    identifier: z.string(),
    connectionString: z.string(),
    fileAccessor: z.custom<FileAccessor>(),
  })
  .superRefine((data, ctx) => {
    if (data.engine === DatabaseEngine.None) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please select a database engine.',
        path: ['engine'],
      })
    }

    if (data.mode === DataSourceMode.None) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please select a data source mode.',
        path: ['mode'],
      })
    }

    if (data.driver === DataSourceDriver.None) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please select a data source driver.',
        path: ['driver'],
      })
    }

    const requiresIdentifier = getDriverCapability(
      data.driver,
      DataSourceDriverCapability.Identifier,
    )

    if (requiresIdentifier) {
      validateIdentifier(data, ctx)
    }

    const requiresConnectionString = getDriverCapability(
      data.driver,
      DataSourceDriverCapability.ConnectionString,
    )

    if (requiresConnectionString) {
      validateConnectionString(data, ctx)
    }
  })

function validateIdentifier(
  data: z.infer<typeof dataSourceSchema>,
  ctx: z.RefinementCtx,
) {
  if (data.identifier.length < 1) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Please enter an identifier.',
      path: ['identifier'],
    })
  }

  if (data.identifier.length > 64) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Identifiers must be 64 characters or less.',
      path: ['identifier'],
    })
  }

  if (data.identifier.includes(' ')) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Identifiers cannot contain spaces.',
      path: ['identifier'],
    })
  }
}

function validateConnectionString(
  data: z.infer<typeof dataSourceSchema>,
  ctx: z.RefinementCtx,
) {
  if (data.connectionString.length < 1) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Please enter a connection string.',
      path: ['connectionString'],
    })
  }
}
