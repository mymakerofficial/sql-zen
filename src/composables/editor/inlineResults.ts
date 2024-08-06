import type { UseEditor } from '@/composables/editor/useEditor'
import { useRunnerQueries } from '@/composables/useRunnerQueries'
import { h, type MaybeRefOrGetter, render, type VNode, watchEffect } from 'vue'
import { toValue } from '@vueuse/core'
import type { QueryInfo } from '@/lib/queries/interface'

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

    const viewZones: Array<string> = []

    function addResult(queryInfo: QueryInfo) {
      editor.changeViewZones((vzChanger) => {
        const query = runner!.getQuery(queryInfo.id)

        const domNode = createDomNode(
          h(
            'p',
            { class: 'text-muted-foreground italic' },
            'sorry, inline results are currently disabled...',
          ),
        )

        const id = vzChanger.addZone({
          afterLineNumber: query.getStatement().range!.endLineNumber,
          // heightInPx: 58 + 48 * ((query.getResult()?.rows.length || 0) + 1),
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
        toValue(queries)
          .filter((it) => it.hasResultRows)
          .forEach(addResult)
      }
    })
  }
}

function createDomNode(node: VNode) {
  const container = document.createElement('div')
  render(node, container)
  return container
}
