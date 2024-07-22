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
import { useEditorContent } from '@/composables/editor/useEditorContent'
import type { Runner } from '@/lib/runner/runner'

type UseEditorPlugin = (editor: UseEditor) => void

type UseEditorProps = {
  model: monaco.editor.ITextModel
  runner?: Runner | null
  getStatements?:
    | ((editor: UseEditor) => ComputedRef<Array<FoundStatement>>)
    | null
}

export class UseEditor {
  private readonly container: HTMLElement
  public readonly editor: monaco.editor.IStandaloneCodeEditor
  public readonly runner: Runner | null = null
  public readonly content: ComputedRef<string>
  public readonly statements: ComputedRef<Array<FoundStatement>>

  constructor({ model, runner, getStatements }: UseEditorProps) {
    this.container = createContainer()
    this.editor = monaco.editor.create(this.container, {
      model,
      automaticLayout: true,
      minimap: {
        enabled: false,
      },
      glyphMargin: true,
    })
    this.runner = runner ?? null

    onScopeDispose(() => {
      this.editor.dispose()
    })

    // we always use the theme plugin
    this.use(themePlugin)

    this.content = useEditorContent(this.editor)
    this.statements = getStatements ? getStatements(this) : computed(() => [])
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

export function getStatements({
  content,
}: UseEditor): ComputedRef<Array<FoundStatement>> {
  return computed(() => findStatements(content.value))
}

function createContainer() {
  const el = document.createElement('div')
  el.className = 'w-full h-full'
  return el
}
