import * as monaco from 'monaco-editor'
import {
  computed,
  type ComputedRef,
  type MaybeRefOrGetter,
  onScopeDispose,
  watchEffect,
} from 'vue'
import { toValue, useMediaQuery } from '@vueuse/core'
import themePlugin from '@/composables/editor/theme'
import { useEditorContent } from '@/composables/editor/useEditorContent'
import { findStatements } from '@/lib/statements/findStatements'
import type { Statement } from '@/lib/statements/interface'
import type { Runner } from '@/lib/runner/impl/runner'

type UseEditorPlugin<T> = (editor: UseEditor) => T

type UseEditorProps = {
  model: monaco.editor.ITextModel
  runner?: Runner | null
  getStatements?: ((editor: UseEditor) => ComputedRef<Array<Statement>>) | null
  readonly?: MaybeRefOrGetter<boolean>
  glyphMargin?: MaybeRefOrGetter<boolean>
  lineNumbers?: MaybeRefOrGetter<boolean>
}

const smallScreen = useMediaQuery('(min-width: 640px)')

export class UseEditor {
  private readonly container: HTMLElement
  public readonly editor: monaco.editor.IStandaloneCodeEditor
  public readonly runner: Runner | null = null
  public readonly content: ComputedRef<string>
  public readonly statements: ComputedRef<Array<Statement>>

  public readonly glyphMargin: MaybeRefOrGetter<boolean>
  public readonly lineNumbers: MaybeRefOrGetter<boolean>

  constructor({
    model,
    runner,
    getStatements,
    readonly = false,
    glyphMargin = true,
    lineNumbers = true,
  }: UseEditorProps) {
    this.runner = runner ?? null
    this.container = createContainer()
    this.editor = monaco.editor.create(this.container, {
      model,
      automaticLayout: true,
      minimap: {
        enabled: false,
      },
    })

    this.glyphMargin = computed(() => {
      return glyphMargin && smallScreen.value
    })
    this.lineNumbers = lineNumbers

    onScopeDispose(() => {
      this.editor.dispose()
    })

    watchEffect(() => {
      this.editor.updateOptions({
        readOnly: toValue(readonly),
        glyphMargin: toValue(this.glyphMargin),
        lineNumbers: toValue(this.lineNumbers) ? 'on' : 'off',
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
