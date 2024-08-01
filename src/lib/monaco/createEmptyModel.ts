import type { Language } from '@/lib/langs/enums'
import * as monaco from 'monaco-editor'

export function createEmptyModel(language: Language): monaco.editor.ITextModel {
  return monaco.editor.createModel('', language)
}
