import * as monaco from 'monaco-editor'
import { type FoundStatement } from '@/lib/statements'
import { h, type MaybeRefOrGetter, render, type VNode, watchEffect } from 'vue'
import { Button } from '@/components/ui/button'
import { DotIcon, LoaderCircleIcon, PlayIcon } from 'lucide-vue-next'
import type { UseEditor } from '@/composables/editor/useEditor'
import { useRunnerQueries } from '@/composables/useRunnerQueries'
import { isIdle, isRunning } from '@/lib/runner/runner'
import { toValue } from '@vueuse/core'

export default function inlineRunPlugin({
  enabled = true,
}: {
  enabled?: MaybeRefOrGetter<boolean>
} = {}) {
  return ({ editor, statements, runner, glyphMargin }: UseEditor) => {
    if (!runner) {
      throw new Error('Runner is required for inlineRunPlugin')
    }

    let glyphs: Array<monaco.editor.IGlyphMarginWidget> = []

    const queries = useRunnerQueries(runner)

    function handleRun(statement: FoundStatement) {
      runner!.run([statement])
    }

    function clearGlyphs() {
      glyphs.forEach((glyph) => editor.removeGlyphMarginWidget(glyph))
      glyphs = []
    }

    function createGlyphs(statements: Array<FoundStatement>) {
      glyphs = statements.map((statement) => ({
        getId: () => statement.key,
        getDomNode: () => {
          const query = queries.value.find(
            (query) => query.key === statement.key,
          )

          if (query && isRunning(query)) {
            return createDomNode(createSpinner())
          }

          if (query && isIdle(query)) {
            return createDomNode(createDot())
          }

          return createDomNode(createRunButton(() => handleRun(statement)))
        },
        getPosition: () => ({
          lane: monaco.editor.GlyphMarginLane.Center,
          zIndex: 10,
          range: statement,
        }),
      }))
      glyphs.forEach((glyph) => editor.addGlyphMarginWidget(glyph))
    }

    watchEffect(() => {
      clearGlyphs()
      if (toValue(enabled) && toValue(glyphMargin)) {
        createGlyphs(toValue(statements))
      }
    })
  }
}

function createDomNode(node: VNode) {
  const container = document.createElement('div')
  render(node, container)
  return container
}

function createRunButton(onClick: () => void) {
  return h(
    Button,
    {
      class: '-mt-1 ml-1 h-6',
      size: 'xs',
      variant: 'ghost',
      onClick,
    },
    () => h(PlayIcon, { class: 'size-4 min-w-max text-green-500' }),
  )
}

function createSpinner() {
  return h(LoaderCircleIcon, { class: 'ml-3 size-4 min-w-max animate-spin' })
}

function createDot() {
  return h(DotIcon, { class: 'ml-3 size-4 text-muted-foreground' })
}
