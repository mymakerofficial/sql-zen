import * as monaco from 'monaco-editor'
import {
  computed,
  type ComputedRef,
  type MaybeRefOrGetter,
  onScopeDispose,
  watchEffect,
} from 'vue'
import { toValue } from '@vueuse/core'
import themePlugin from '@/composables/editor/theme'
import type { FoundStatement } from '@/lib/statements'
import { findStatements } from '@/lib/statements'
import { useEditorValue } from '@/composables/editor/useEditorValue'

type UseEditorPlugin = (editor: UseEditor) => void

type UseEditorProps = {
  model: monaco.editor.ITextModel
}

export class UseEditor {
  private readonly container: HTMLElement
  public editor: monaco.editor.IStandaloneCodeEditor
  public statements: ComputedRef<Array<FoundStatement>>

  constructor({ model }: UseEditorProps) {
    this.container = createContainer()
    this.editor = monaco.editor.create(this.container, {
      model,
      automaticLayout: true,
      minimap: {
        enabled: false,
      },
      glyphMargin: true,
    })

    onScopeDispose(() => {
      this.editor.dispose()
    })

    // we always use the theme plugin
    this.use(themePlugin)

    const editorValue = useEditorValue(this.editor)
    this.statements = computed(() => findStatements(editorValue.value))
  }

  mount(el: MaybeRefOrGetter<HTMLElement | null>) {
    watchEffect(() => {
      const _el = toValue(el)
      if (!_el) return
      _el.appendChild(this.container)
    })
  }

  use(plugin: UseEditorPlugin) {
    plugin(this)
  }
}

export function useEditor(props: UseEditorProps): UseEditor {
  return new UseEditor(props)
}

function createContainer() {
  const el = document.createElement('div')
  el.className = 'w-full h-full'
  return el
}
