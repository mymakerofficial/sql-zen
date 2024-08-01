import { Language } from '@/lib/langs/enums'

export const extensionLanguageMap = {
  [Language.SQL]: ['sql'],
  [Language.CSV]: ['csv'],
  [Language.JSON]: ['json', 'geojson'],
  [Language.Text]: ['txt', 'text', 'log'],
} as const satisfies Record<Language, string[]>
