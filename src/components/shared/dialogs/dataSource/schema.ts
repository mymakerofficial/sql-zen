import { DatabaseEngine, DataSourceDriver } from '@/lib/engines/enums'
import * as z from 'zod'
import { DataSourceMode } from '@/lib/dataSources/enums'
import { FileAccessor } from '@/lib/files/fileAccessor'

export const dataSourceSchema = z
  .object({
    engine: z.nativeEnum(DatabaseEngine),
    mode: z.nativeEnum(DataSourceMode),
    driver: z.nativeEnum(DataSourceDriver),
    displayName: z.string().min(1).max(64),
    identifier: z.string(),
    connectionString: z.string(),
    fileAccessor: z.custom<FileAccessor>(),
  })
  .superRefine((data, ctx) => {
    if (data.engine === DatabaseEngine.None) {
      return ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please select a database engine.',
        path: ['engine'],
      })
    }

    if (data.mode === DataSourceMode.None) {
      return ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please select a data source mode.',
        path: ['mode'],
      })
    }

    if (data.driver === DataSourceDriver.None) {
      return ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please select a data source driver.',
        path: ['driver'],
      })
    }
  })
