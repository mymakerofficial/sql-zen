import { createHighlighter } from 'shiki'
import { Language } from '@/lib/langs/enums'

export const highlighter = await createHighlighter({
  themes: ['vitesse-dark', 'vitesse-light'],
  langs: Object.values(Language),
})

export function getThemeFromMode(mode: string) {
  return mode === 'light' ? 'vitesse-light' : 'vitesse-dark'
}
