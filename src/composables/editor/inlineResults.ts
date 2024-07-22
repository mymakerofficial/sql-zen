import type { UseEditor } from '@/composables/editor/useEditor'
import { useRunnerQueries } from '@/composables/useRunnerQueries'
import { computed, h, render, type VNode, watch } from 'vue'
import { isSuccessful, type QuerySuccess } from '@/lib/runner/runner'
import ResultTable from '@/components/shared/table/ResultTable.vue'

export default function inlineResultsPlugin({ editor, runner }: UseEditor) {
  if (!runner) {
    throw new Error('Runner is required for inlineResultsPlugin')
  }

  const queries = useRunnerQueries(runner)
  const successQueries = computed(() => {
    return queries.value
      .filter(isSuccessful)
      .filter((query) => query.range && query.result.length > 0)
  })

  const viewZones: Array<string> = []

  function addResult(query: QuerySuccess) {
    editor.changeViewZones((vzChanger) => {
      const { result, range } = query

      let domNode = createDomNode(
        h(ResultTable, {
          class: 'relative z-10 w-fit border border-border my-2',
          data: result,
        }),
      )

      const id = vzChanger.addZone({
        afterLineNumber: range!.endLineNumber,
        heightInPx: 58 + 48 * (result.length + 1),
        domNode,
      })
      viewZones.push(id)
    })
  }

  function clearResults() {
    editor.changeViewZones((vzChanger) => {
      viewZones.forEach((id) => vzChanger.removeZone(id))
      viewZones.length = 0
    })
  }

  function handler(results: Array<QuerySuccess>) {
    clearResults()
    results.forEach(addResult)
  }

  watch(() => successQueries.value, handler, { immediate: true })
}

function createDomNode(node: VNode) {
  const container = document.createElement('div')
  render(node, container)
  return container
}
