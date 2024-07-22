import * as monaco from 'monaco-editor'
import { type MaybeRefOrGetter, onScopeDispose, watchEffect } from 'vue'
import { toValue } from '@vueuse/core'
import themePlugin from '@/composables/editor/theme'

type UseEditorPlugin = (editor: monaco.editor.IStandaloneCodeEditor) => void

type UseEditorProps = {
  model: monaco.editor.ITextModel
}

export function useEditor({ model }: UseEditorProps) {
  const container = createContainer()
  const editor = monaco.editor.create(container, {
    model,
    automaticLayout: true,
    minimap: {
      enabled: false,
    },
    glyphMargin: true,
  })

  function mount(el: MaybeRefOrGetter<HTMLElement | null>) {
    watchEffect(() => {
      const _el = toValue(el)
      if (!_el) return
      _el.appendChild(container)
    })
  }

  function use(plugin: UseEditorPlugin) {
    plugin(editor)
  }

  onScopeDispose(() => {
    editor.dispose()
  })

  // we always use the theme plugin
  use(themePlugin)

  return { editor, mount, use }
}

function createContainer() {
  const el = document.createElement('div')
  el.className = 'w-full h-full'
  return el
}
