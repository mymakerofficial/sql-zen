<script setup lang="ts">
import { useRegistry } from '@/composables/useRegistry'
import { useDialogContext } from '@/composables/useDialog'
import { useEditor } from '@/composables/editor/useEditor'
import MonacoEditor from '@/components/shared/monaco/MonacoEditor.vue'
import { Label } from '@/components/ui/label'
import * as monaco from 'monaco-editor'
import { Input } from '@/components/ui/input'
import { computed, ref } from 'vue'
import CodeBlock from '@/components/shared/CodeBlock.vue'
import { LoaderCircleIcon, SparklesIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { FileAccessor } from '@/lib/files/fileAccessor'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useMutation } from '@tanstack/vue-query'
import { useTransformerPipeline } from '@/composables/transformers/useTransformerPipeline'
import { Progress } from '@/components/ui/progress'
import { getId } from '@/lib/getId'
import { GteSmall } from '@/lib/transformers/singletons/gteSmall'
import {
  type GenerateEmbeddingsInput,
  useGenerateEmbeddings,
} from '@/composables/transformers/useGenerateEmbeddings'

const props = defineProps<{
  dataSourceKey: string
}>()

const { open, close } = useDialogContext()

const registry = useRegistry()
const dataSource = registry.getDataSource(props.dataSourceKey)

const {
  pipeline,
  isLoading: pipelineIsLoading,
  progress: pipelineProgress,
} = useTransformerPipeline(GteSmall)

const {
  generateAsync,
  isPending: generationIsPending,
  progress: generationProgress,
} = useGenerateEmbeddings(pipeline)

const tableName = ref('shakespeare')
const primaryColumnName = ref('line_id')
const primaryColumnType = ref('text')
const limit = ref(100)
const offset = ref(0)

const editor = useEditor({
  model: monaco.editor.createModel(
    //"SELECT id, concat_ws(', ', title, description) as text FROM products;",
    `SELECT
    line_id as id,
    concat_ws(', ', play_name, speaker, text_entry) as text
FROM shakespeare
WHERE play_name = 'Romeo and Juliet'`,
    'sql',
  ),
  glyphMargin: false,
  lineNumbers: false,
})

const embeddingsTableName = computed(() => {
  return `${tableName.value}_embeddings`
})

const embeddingsTableCreateStatement = computed(() => {
  return `CREATE TABLE IF NOT EXISTS ${embeddingsTableName.value}
(
    ${primaryColumnName.value} ${primaryColumnType.value.toUpperCase()},
    embedding VECTOR(384)
)`
})

async function generateEmbeddings() {
  const selectStmt = editor.editor.getModel()?.getValue()
  if (!selectStmt) {
    return
  }

  const dialect = dataSource.getDialect()

  // load vector extension
  await dataSource.query(`CREATE EXTENSION IF NOT EXISTS vector`)

  // create embeddings table
  await dataSource.query(embeddingsTableCreateStatement.value)

  const { rows } = await dataSource.query<GenerateEmbeddingsInput>(
    dialect.makePaginatedStatement(selectStmt, offset.value, limit.value),
  )

  // generate embeddings
  const embeddingsData = await generateAsync(rows)

  // create blob
  const blobData = [
    `${primaryColumnName.value},embedding`,
    ...embeddingsData.map((row) => `${row.id};[${row.embedding.join(',')}]`),
  ].join('\n')
  const fileAccessor = FileAccessor.fromText(blobData, '')

  // upload embeddings
  const fileName = `${getId('tmp')}.csv`
  await dataSource.writeFile(fileName, fileAccessor)
  await dataSource.query(
    `COPY ${embeddingsTableName.value} FROM '/var/${fileName}' DELIMITER ';' CSV HEADER ENCODING 'UTF8'`,
  )
  await dataSource.deleteFile(`/var/${fileName}`)
}

const {
  mutate: handleGenerateEmbeddings,
  error,
  isPending,
} = useMutation({
  mutationFn: generateEmbeddings,
  onSuccess: close,
})
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent
      class="max-w-full w-full max-h-full lg:w-1/2 lg:max-h-3/4 lg:flex flex-col"
    >
      <DialogHeader>
        <DialogTitle>Embeddings (Experimental)</DialogTitle>
        <DialogDescription>
          Generate embeddings for any table in the database. Embeddings can be
          used to perform semantic search, similarity search, and more. The
          embeddings are generated using <code>gte-small</code> which will be
          downloaded from huggingface.co
        </DialogDescription>
      </DialogHeader>
      <div class="my-6 flex flex-col gap-6 overflow-y-auto">
        <div class="flex flex-wrap gap-4">
          <section class="space-y-2 col-span-2">
            <Label for="tableName" class="text-right">Table Name</Label>
            <Input
              v-model="tableName"
              :disabled="isPending"
              id="tableName"
              class="w-fit"
            />
          </section>
          <section class="space-y-2">
            <Label for="primaryColumnName" class="text-right"
              >Primary Column</Label
            >
            <Input
              v-model="primaryColumnName"
              :disabled="isPending"
              id="primaryColumnName"
              class="w-fit"
            />
          </section>
          <section class="space-y-2">
            <Label for="primaryColumnType" class="text-right"
              >Primary Column Type</Label
            >
            <Input
              v-model="primaryColumnType"
              :disabled="isPending"
              id="primaryColumnType"
              class="w-fit"
            />
          </section>
        </div>
        <div class="flex flex-wrap gap-4">
          <section class="space-y-2 col-span-2">
            <Label for="limit">Limit</Label>
            <Input
              v-model="limit"
              :disabled="isPending"
              id="limit"
              class="w-fit"
            />
          </section>
          <section class="space-y-2">
            <Label for="offset">Offset</Label>
            <Input
              v-model="offset"
              :disabled="isPending"
              id="offset"
              class="w-fit"
            />
          </section>
        </div>
        <section class="space-y-2">
          <Label>Select Statement</Label>
          <p class="text-sm text-muted-foreground">
            Statement used to retrieve the data that will be embedded. Must
            return <code>`id`</code> and <code>`text`</code> columns.
          </p>
          <MonacoEditor :editor="editor" class="h-20" />
        </section>
        <Separator />
        <section class="space-y-2">
          <Label>Embeddings Table Create Statement</Label>
          <p class="text-sm text-muted-foreground">
            Auto generated create statement for the embeddings table.
          </p>
          <CodeBlock
            :code="embeddingsTableCreateStatement"
            class="text-xs [&_pre]:p-3"
          />
        </section>
        <div v-if="generationIsPending" class="space-y-1">
          <Label>Generating Embeddings...</Label>
          <Progress :model-value="generationProgress" />
        </div>
        <div v-if="pipelineIsLoading" class="space-y-1">
          <Label>Loading model...</Label>
          <Progress :model-value="pipelineProgress" />
        </div>
      </div>
      <p v-if="error" class="text-red-500">{{ error }}</p>
      <DialogFooter>
        <Button
          @click="handleGenerateEmbeddings"
          :disabled="isPending"
          class="gap-3"
        >
          <LoaderCircleIcon
            v-if="isPending"
            class="size-4 min-w-max animate-spin"
          />
          <SparklesIcon v-else class="size-4 min-w-max" />
          <span>Generate</span>
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
