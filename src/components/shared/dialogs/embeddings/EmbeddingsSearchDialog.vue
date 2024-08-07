<script setup lang="ts">
import { useRegistry } from '@/composables/useRegistry'
import { useDialogContext } from '@/composables/useDialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { ref } from 'vue'
import { env, FeatureExtractionPipeline, pipeline } from '@xenova/transformers'
import { SearchIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { djb2 } from '@/lib/hash'
import { useMutation } from '@tanstack/vue-query'

env.allowLocalModels = false

const props = defineProps<{
  dataSourceKey: string
}>()

const { open, close } = useDialogContext()

const registry = useRegistry()
const runner = registry.getRunner(props.dataSourceKey)

const searchTerm = ref('')
const tableName = ref('shakespeare')
const primaryColumnName = ref('line_id')

let pipelineInstance: FeatureExtractionPipeline | null = null
async function getPipeline() {
  if (pipelineInstance) {
    return pipelineInstance
  }
  pipelineInstance = await pipeline(
    'feature-extraction',
    'Supabase/gte-small',
    {
      progress_callback: (event: object) => {
        console.log(event)
      },
    },
  )
  return pipelineInstance
}

async function search() {
  // load model
  const pipeline = await getPipeline()

  // generate embeddings
  const embedding = await pipeline(searchTerm.value, {
    pooling: 'mean',
    normalize: true,
  })
  console.log(embedding)

  const statement = `SELECT t.*, e.embedding <-> '[${embedding.data.join(',')}]' as distance
FROM ${tableName.value}_embeddings as e
LEFT JOIN ${tableName.value} as t
ON t.${primaryColumnName.value} = e.${primaryColumnName.value}
ORDER BY distance`

  console.log(statement)
  runner.batch([
    {
      sql: statement,
      key: `stmt_auto_${djb2(statement)}`,
    },
  ])
  close()
}

const { mutate: handleSearch, isPending } = useMutation({
  mutationFn: search,
})
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent class="max-w-full w-full lg:w-1/2 lg:flex flex-col">
      <DialogHeader>
        <DialogTitle>Embeddings (Experimental)</DialogTitle>
        <DialogDescription>
          Generate embeddings for any table in the database. Embeddings can be
          used to perform semantic search, similarity search, and more. The
          embeddings are generated using <code>gte-small</code> which will be
          downloaded from huggingface.co
        </DialogDescription>
      </DialogHeader>
      <div class="grid gap-4 py-4 mx-4 md:mx-0">
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="searchTerm" class="text-right">Search Term</Label>
          <Input
            v-model="searchTerm"
            :disabled="isPending"
            id="searchTerm"
            class="col-span-3"
          />
        </div>
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
      </div>
      <DialogFooter>
        <Button @click="handleSearch" :disabled="isPending" class="gap-3">
          <SearchIcon class="size-4 min-w-max" />
          <span>Search</span>
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
