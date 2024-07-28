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
import { useEditorContent } from '@/composables/editor/useEditorContent'
import type { IRunner } from '@/lib/runner/interface'
import { findStatements } from '@/lib/statements/findStatements'
import type { Statement } from '@/lib/statements/interface'

type UseEditorPlugin<T> = (editor: UseEditor) => T

type UseEditorProps = {
  model: monaco.editor.ITextModel
  runner?: IRunner | null
  glyphMargin?: MaybeRefOrGetter<boolean>
  getStatements?: ((editor: UseEditor) => ComputedRef<Array<Statement>>) | null
}

export class UseEditor {
  private readonly container: HTMLElement
  public readonly editor: monaco.editor.IStandaloneCodeEditor
  public readonly runner: IRunner | null = null
  public readonly glyphMargin: MaybeRefOrGetter<boolean>
  public readonly content: ComputedRef<string>
  public readonly statements: ComputedRef<Array<Statement>>

  constructor({
    model,
    runner,
    glyphMargin = true,
    getStatements,
  }: UseEditorProps) {
    this.runner = runner ?? null
    this.glyphMargin = glyphMargin
    this.container = createContainer()
    this.editor = monaco.editor.create(this.container, {
      model,
      automaticLayout: true,
      minimap: {
        enabled: false,
      },
    })

    onScopeDispose(() => {
      this.editor.dispose()
    })

    watchEffect(() => {
      this.editor.updateOptions({
        glyphMargin: toValue(glyphMargin),
      })
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

  use<T>(plugin: UseEditorPlugin<T>) {
    return plugin(this)
  }
}

export function useEditor(props: UseEditorProps): UseEditor {
  return new UseEditor(props)
}

export function getStatements({
  content,
}: UseEditor): ComputedRef<Array<Statement>> {
  return computed(() => findStatements(content.value))
}

function createContainer() {
  const el = document.createElement('div')
  el.className = 'w-full h-full'
  return el
}
