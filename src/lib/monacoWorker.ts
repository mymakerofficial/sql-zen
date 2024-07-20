import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'

// @ts-ignore
self.MonacoEnvironment = {
  getWorker(_: any, _label: string) {
    return new editorWorker()
  },
}
