<script setup lang="ts">
import { useRegistry } from '@/composables/useRegistry'
import { useDialogContext } from '@/composables/useDialog'
import { useEditor } from '@/composables/editor/useEditor'
import MonacoEditor from '@/components/shared/monaco/MonacoEditor.vue'
import { Label } from '@/components/ui/label'
import * as monaco from 'monaco-editor'
import { Input } from '@/components/ui/input'
import { ref } from 'vue'
import { SparklesIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { FileAccessor } from '@/lib/files/fileAccessor'
import { DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { useMutation } from '@tanstack/vue-query'
import { useTransformerPipeline } from '@/composables/transformers/useTransformerPipeline'
import { Progress } from '@/components/ui/progress'
import { getId } from '@/lib/getId'
import { GteSmall } from '@/lib/transformers/singletons/gteSmall'
import {
  type GenerateEmbeddingsInput,
  useGenerateEmbeddings,
} from '@/composables/transformers/useGenerateEmbeddings'
import ResponsiveDialog from '@/components/shared/responsiveDialog/ResponsiveDialog.vue'
import ResponsiveDialogContent from '@/components/shared/responsiveDialog/ResponsiveDialogContent.vue'
import ResponsiveDialogHeader from '@/components/shared/responsiveDialog/ResponsiveDialogHeader.vue'
import ResponsiveDialogFooter from '@/components/shared/responsiveDialog/ResponsiveDialogFooter.vue'
import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from '@/components/ui/stepper'

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

const step = ref(1)

const tableName = ref('')
const primaryColumnName = ref('id')
const primaryColumnType = ref('text')

const editor = useEditor({
  model: monaco.editor.createModel(
    `SELECT
    id,
    concat_ws(', ', title, description) as text
FROM products
LIMIT 1000`,
    'sql',
  ),
  glyphMargin: false,
  lineNumbers: false,
})

async function generateEmbeddings() {
  const selectStmt = editor.editor.getModel()?.getValue()
  if (!selectStmt) {
    return
  }

  step.value = 3

  // load vector extension
  await dataSource.query(`CREATE EXTENSION IF NOT EXISTS vector`)

  // create embeddings table
  const embeddingsTableName = `${tableName.value}_embeddings`
  await dataSource.query(`CREATE TABLE IF NOT EXISTS ${embeddingsTableName}
(
    ${primaryColumnName.value} ${primaryColumnType.value.toUpperCase()},
    embedding VECTOR(384)
)`)

  const { rows } = await dataSource.query<GenerateEmbeddingsInput>(selectStmt)

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
    `COPY ${embeddingsTableName} FROM '/var/${fileName}' DELIMITER ';' CSV HEADER ENCODING 'UTF8'`,
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
  <ResponsiveDialog v-model:open="open">
    <ResponsiveDialogContent class="lg:max-w-full lg:w-1/2">
      <ResponsiveDialogHeader>
        <DialogTitle>Generate Embeddings</DialogTitle>
        <DialogDescription>
          Generate embeddings for any table in the database. Embeddings can be
          used to perform semantic search. The embeddings are generated using
          <code>gte-small</code> which will be downloaded from huggingface.co
        </DialogDescription>
      </ResponsiveDialogHeader>
      <Stepper v-if="step !== 3" v-model="step" class="mx-4 md:-mx-1">
        <StepperItem :step="1">
          <StepperTrigger>
            <StepperIndicator />
            <StepperTitle class="sr-only">Select Table</StepperTitle>
          </StepperTrigger>
          <StepperSeparator />
        </StepperItem>
        <StepperItem :step="2">
          <StepperTrigger>
            <StepperIndicator />
            <StepperTitle class="sr-only">Configure Input</StepperTitle>
          </StepperTrigger>
        </StepperItem>
      </Stepper>
      <div v-if="step === 1" class="grid gap-4 p-4 overflow-y-auto">
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="tableName" class="text-right">Table Name</Label>
          <Input
            v-model="tableName"
            :disabled="isPending"
            id="tableName"
            class="col-span-3"
          />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="primaryColumnName" class="text-right"
            >Primary Column Name</Label
          >
          <Input
            v-model="primaryColumnName"
            :disabled="isPending"
            id="primaryColumnName"
            class="col-span-3"
          />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="primaryColumnType" class="text-right"
            >Primary Column Type</Label
          >
          <Input
            v-model="primaryColumnType"
            :disabled="isPending"
            id="primaryColumnType"
            class="col-span-3"
          />
        </div>
      </div>
      <div
        v-if="step === 2"
        class="my-6 md:my-2 px-6 md:px-2 flex flex-col gap-6 overflow-y-auto"
      >
        <section class="space-y-2">
          <Label>Select Statement</Label>
          <p class="text-sm text-muted-foreground">
            Statement used to retrieve the data that will be embedded. Must
            return <code>`id`</code> and <code>`text`</code> columns.
          </p>
          <MonacoEditor :editor="editor" class="min-h-40 h-40 max-h-40" />
        </section>
      </div>
      <div v-if="step === 3" class="my-6 px-4 flex flex-col gap-3">
        <div class="space-y-1">
          <Label>Loading...</Label>
          <p class="text-muted-foreground text-sm">
            Please be patient. This may take a while.
          </p>
        </div>
        <div v-if="generationIsPending" class="space-y-2">
          <Label>Generating Embeddings...</Label>
          <Progress :model-value="generationProgress" />
        </div>
        <div v-if="pipelineIsLoading" class="space-y-2">
          <Label>Loading model...</Label>
          <Progress :model-value="pipelineProgress" />
        </div>
      </div>
      <p v-if="error" class="text-red-500">{{ error }}</p>
      <ResponsiveDialogFooter>
        <Button v-if="step === 1" @click="() => step++">
          <span>Continue</span>
        </Button>
        <Button
          v-else-if="step === 2"
          @click="handleGenerateEmbeddings"
          :disabled="isPending"
          class="gap-3"
        >
          <SparklesIcon class="size-4 min-w-max" />
          <span>Generate</span>
        </Button>
      </ResponsiveDialogFooter>
    </ResponsiveDialogContent>
  </ResponsiveDialog>
</template>
