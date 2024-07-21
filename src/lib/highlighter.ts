import { createHighlighter } from 'shiki'

export const highlighter = await createHighlighter({
  themes: ['vitesse-dark', 'vitesse-light'],
  langs: ['sql'],
})

export function getThemeFromMode(mode: string) {
  return mode === 'light' ? 'vitesse-light' : 'vitesse-dark'
}
