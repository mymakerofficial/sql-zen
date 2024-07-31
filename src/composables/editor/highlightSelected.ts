import type { UseEditor } from '@/composables/editor/useEditor'
import {
  useSelectedStatement,
  useStatementsInSelection,
} from '@/composables/editor/useSelectedStatement'
import highlightStatements from '@/composables/editor/highlightStatements'

export default function highlightSelectedPlugin(editor: UseEditor) {
  const statements = useStatementsInSelection(editor)
  editor.use(highlightStatements(statements))
}
