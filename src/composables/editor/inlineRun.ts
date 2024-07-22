import * as monaco from 'monaco-editor'
import { type FoundStatement } from '@/lib/statements'
import { toValue, useDebounceFn } from '@vueuse/core'
import { h, render, type VNode, watch } from 'vue'
import { Button } from '@/components/ui/button'
import { PlayIcon } from 'lucide-vue-next'
import type { UseEditor } from '@/composables/editor/useEditor'

export default function inlineRunPlugin({
  editor,
  statements,
  runner,
}: UseEditor) {
  if (!runner) {
    throw new Error('Runner is required for inlineRunPlugin')
  }

  let glyphs: Array<monaco.editor.IGlyphMarginWidget> = []

  function handleRun(statement: FoundStatement) {
    runner!.push([statement])
  }

  function clearGlyphs() {
    glyphs.forEach((glyph) => editor.removeGlyphMarginWidget(glyph))
    glyphs = []
  }

  function createGlyphs(statements: Array<FoundStatement>) {
    glyphs = statements.map((statement, index) => ({
      getId: () => `${index}`,
      getDomNode: () =>
        createDomNode(createRunButton(() => handleRun(statement))),
      getPosition: () => ({
        lane: monaco.editor.GlyphMarginLane.Center,
        zIndex: 10,
        range: statement,
      }),
    }))
    glyphs.forEach((glyph) => editor.addGlyphMarginWidget(glyph))
  }

  function handler(statements: Array<FoundStatement>) {
    clearGlyphs()
    createGlyphs(statements)
  }

  const debouncedHandler = useDebounceFn(handler, 100)
  watch(() => toValue(statements), debouncedHandler, { immediate: true })
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
    () => h(PlayIcon, { class: 'size-4 text-green-500' }),
  )
}
