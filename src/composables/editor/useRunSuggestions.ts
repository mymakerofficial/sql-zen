import type { UseEditor } from '@/composables/editor/useEditor'
import {
  useSelectedStatement,
  useStatementsAfterSelected,
  useStatementsInSelection,
} from '@/composables/editor/useSelectedStatement'
import { computed } from 'vue'
import type { Statement } from '@/lib/statements/interface'
import { asArray } from '@/lib/asArray'

export type RunSuggestion = {
  key: string
  short: string
  statements: Array<Statement>
}

export function useRunSuggestions(editor: UseEditor) {
  const selected = useSelectedStatement(editor)
  const inSelection = useStatementsInSelection(editor)
  const afterSelected = useStatementsAfterSelected(editor)

  return computed(() =>
    removeDuplicates(
      [
        createSuggestion(inSelection.value),
        createSuggestion(selected.value),
        createSuggestion(afterSelected.value),
        createSuggestion(editor.statements.value),
      ].filter((s) => s && s.statements.length) as Array<RunSuggestion>,
    ),
  )
}

function createSuggestion(
  statements: Array<Statement> | Statement | null,
): RunSuggestion | null {
  if (!statements) {
    return null
  }

  const statementsArray = asArray(statements)

  return {
    key: statementsArray.map((s) => s.key).join('_'),
    short: statementsArray
      // remove newlines and extra spaces
      .map((s) => s.sql.replace(/(\r\n|\n|\r)(\s\s+)/gm, ' '))
      .join('; ')
      .concat(';'),
    statements: statementsArray,
  }
}

function removeDuplicates(
  suggestions: Array<RunSuggestion>,
): Array<RunSuggestion> {
  return suggestions.filter((s, i) => {
    const keys = suggestions.map((s) => s.key)
    return keys.indexOf(s.key) === i
  })
}
