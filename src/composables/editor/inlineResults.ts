import type { UseEditor } from '@/composables/editor/useEditor'
import { useRunnerQueries } from '@/composables/useRunnerQueries'
import {
  computed,
  h,
  type MaybeRefOrGetter,
  render,
  type VNode,
  watchEffect,
} from 'vue'
import ResultTable from '@/components/shared/table/ResultTable.vue'
import { toValue } from '@vueuse/core'
import { isSuccessQuery } from '@/lib/queries/helpers'
import type { SuccessQuery } from '@/lib/queries/interface'

export default function inlineResultsPlugin({
  enabled = true,
}: {
  enabled?: MaybeRefOrGetter<boolean>
} = {}) {
  return ({ editor, runner }: UseEditor) => {
    if (!runner) {
      throw new Error('Runner is required for inlineResultsPlugin')
    }

    const queries = useRunnerQueries(runner)
    const successQueries = computed(() => {
      return queries.value
        .filter(isSuccessQuery)
        .filter(
          (query) => query.statement.range && query.result.rows.length > 0,
        )
    })

    const viewZones: Array<string> = []

    function addResult(query: SuccessQuery) {
      editor.changeViewZones((vzChanger) => {
        const { result, statement } = query

        const domNode = createDomNode(
          h(ResultTable, {
            class: 'relative z-10 w-fit border border-border my-2',
            data: result,
          }),
        )

        const id = vzChanger.addZone({
          afterLineNumber: statement.range!.endLineNumber,
          heightInPx: 58 + 48 * (result.rows.length + 1),
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

    watchEffect(() => {
      clearResults()
      if (toValue(enabled)) {
        toValue(successQueries).forEach(addResult)
      }
    })
  }
}

function createDomNode(node: VNode) {
  const container = document.createElement('div')
  render(node, container)
  return container
}
