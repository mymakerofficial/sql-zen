<script setup lang="ts">
import * as monaco from 'monaco-editor'
import { shikiToMonaco } from '@shikijs/monaco'
import { h, onMounted, onScopeDispose, ref, render, type VNode, watch } from 'vue'
import { useActualColorMode } from '@/composables/useActualColorMode'
import { getThemeFromMode, highlighter } from '@/lib/highlighter'
import { PlayIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { findStatements, type FoundStatement } from '@/lib/statements'
import { useDebounceFn } from '@vueuse/core'
import ResultTable from '@/components/shared/table/ResultTable.vue'
import type { QueryResult } from '@/lib/databases/database'

const props = defineProps<{
  model: monaco.editor.ITextModel
  runHandler: (sql: string) => Promise<Array<QueryResult>>
}>()

const container = ref<HTMLElement | null>(null)
let editor: monaco.editor.IStandaloneCodeEditor | null = null

let glyphs: Array<monaco.editor.IGlyphMarginWidget> = []
let viewZones: Array<string> = []
// let decorations: monaco.editor.IEditorDecorationsCollection | null = null

const mode = useActualColorMode()

function decorateStatements() {
  if (!editor) {
    return
  }

  const statements = findStatements(editor.getValue())

  clearDecorations()
  createDecorations(statements)
}

const debounceDecorateStatements = useDebounceFn(decorateStatements, 100)

function runStatement(statement: FoundStatement) {
  const { sql } = statement
  props.runHandler(sql).then((result) => {
    const data = result[0]

    if (!data || data.length === 0 || data.length > 10) {
      return
    }

    editor?.changeViewZones((vzChanger) => {
      let domNode = createDomNode(
        h(
          ResultTable,
          { class: 'relative z-10 w-fit border border-border my-2', data },
        ),
      )

      const id = vzChanger.addZone({
        afterLineNumber: statement.endLineNumber,
        heightInPx: 58 + 48 * (data.length + 1),
        domNode,
      });
      viewZones.push(id);
    });
  })
}

function createDomNode(node: VNode) {
  const container = document.createElement('div')
  render(node, container)
  return container
}

function createRunButton(statement: FoundStatement) {
  return h(
    Button,
    {
      class: '-mt-1 ml-1 h-6',
      size: 'xs',
      variant: 'ghost',
      onClick: () => runStatement(statement),
    },
    () => h(PlayIcon, { class: 'size-4 text-green-500' }),
  )
}

function createDecorations(statements: Array<FoundStatement>) {
  if (!editor) {
    return
  }

  glyphs = statements.map((statement, index) => ({
    getId: () => `${index}`,
    getDomNode: () => {
      return createDomNode(createRunButton(statement))
    },
    getPosition: () => ({
      lane: monaco.editor.GlyphMarginLane.Center,
      zIndex: 100,
      range: statement,
    }),
  }))

  glyphs.forEach((glyph) => {
    editor?.addGlyphMarginWidget(glyph)
  })

  // const colors = ['bg-red-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500']
  // decorations = editor.createDecorationsCollection(
  //   statements.map((statement, index) => ({
  //     range: statement,
  //     options: {
  //       inlineClassName: colors[index % colors.length],
  //     },
  //   })),
  // )
}

function clearDecorations() {
  glyphs?.forEach((glyph) => {
    editor?.removeGlyphMarginWidget(glyph)
  })

  editor?.changeViewZones((vzChanger) => {
    viewZones.forEach((id) => {
      vzChanger.removeZone(id)
    })
  })

  // decorations?.clear()
}

onMounted(async () => {
  shikiToMonaco(highlighter, monaco)

  editor = monaco.editor.create(container.value!, {
    model: props.model,
    automaticLayout: true,
    minimap: {
      enabled: false,
    },
    glyphMargin: true,
    theme: getThemeFromMode(mode.value),
  })

  editor.onDidChangeModelContent(debounceDecorateStatements)

  decorateStatements()
})

watch(mode, () => {
  if (!editor) {
    return
  }

  editor.updateOptions({
    theme: getThemeFromMode(mode.value),
  })
})

onScopeDispose(() => {
  editor?.dispose()
  // highlighter?.dispose() // TODO: Fix this
})
</script>

<template>
  <div ref="container" class="w-full h-full"></div>
</template>
