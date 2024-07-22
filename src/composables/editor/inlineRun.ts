import * as monaco from 'monaco-editor'
import { type FoundStatement } from '@/lib/statements'
import { toValue, useDebounceFn } from '@vueuse/core'
import { h, type MaybeRefOrGetter, render, type VNode, watch } from 'vue'
import { Button } from '@/components/ui/button'
import { PlayIcon } from 'lucide-vue-next'
import type { QueryResult } from '@/lib/databases/database'

export default function inlineRunPlugin({
  statements,
  runHandler,
}: {
  statements: MaybeRefOrGetter<Array<FoundStatement>>
  runHandler: (sql: string) => Promise<Array<QueryResult>>
}) {
  return (editor: monaco.editor.IStandaloneCodeEditor) => {
    let glyphs: Array<monaco.editor.IGlyphMarginWidget> = []

    function clearGlyphs() {
      glyphs.forEach((glyph) => editor.removeGlyphMarginWidget(glyph))
      glyphs = []
    }

    function createGlyphs(statements: Array<FoundStatement>) {
      glyphs = statements.map((statement, index) => ({
        getId: () => `${index}`,
        getDomNode: () =>
          createDomNode(
            createRunButton(() => {
              runHandler(statement.sql).then()
            }),
          ),
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
