import type { AnsiLanguage, BundledLanguage, PlainTextLanguage } from 'shiki'

export const Language = {
  SQL: 'sql',
  CSV: 'csv',
  JSON: 'json',
  Text: 'plaintext',
} as const satisfies Record<
  string,
  BundledLanguage | PlainTextLanguage | AnsiLanguage
>
export type Language = (typeof Language)[keyof typeof Language]
