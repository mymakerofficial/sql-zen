import { extensionLanguageMap } from '@/lib/langs/constants'
import { Language } from '@/lib/langs/enums'

export function getLanguage(filename: string) {
  const ext = filename.split('.').pop()?.toLowerCase()
  if (!ext) {
    return Language.Text
  }
  for (const [lang, extensions] of Object.entries(extensionLanguageMap)) {
    if ((extensions as string[]).includes(ext)) {
      return lang as Language
    }
  }
  return Language.Text
}
