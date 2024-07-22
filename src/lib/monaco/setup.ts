import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import { shikiToMonaco } from '@shikijs/monaco'
import { highlighter } from '@/lib/highlighter'
import * as monaco from 'monaco-editor'

// @ts-ignore
self.MonacoEnvironment = {
  getWorker(_: any, _label: string) {
    return new editorWorker()
  },
}

shikiToMonaco(highlighter, monaco)
