<script setup lang="ts">
import { useRegistry } from '@/composables/useRegistry'
import { useDialogContext } from '@/composables/useDialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { ref } from 'vue'
import { env } from '@xenova/transformers'
import { LoaderCircleIcon, SearchIcon } from 'lucide-vue-next'
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
import { useTransformerPipeline } from '@/composables/transformers/useTransformerPipeline'
import { Progress } from '@/components/ui/progress'
import { GteSmall } from '@/lib/transformers/singletons/gteSmall'
import ResponsiveDialogFooter from '@/components/shared/responsiveDialog/ResponsiveDialogFooter.vue'
import ResponsiveDialog from '@/components/shared/responsiveDialog/ResponsiveDialog.vue'
import ResponsiveDialogContent from '@/components/shared/responsiveDialog/ResponsiveDialogContent.vue'
import ResponsiveDialogHeader from '@/components/shared/responsiveDialog/ResponsiveDialogHeader.vue'

env.allowLocalModels = false

const props = defineProps<{
  dataSourceKey: string
}>()

const { open, close } = useDialogContext()

const registry = useRegistry()
const runner = registry.getRunner(props.dataSourceKey)

const {
  pipeline,
  isLoading: pipelineIsLoading,
  progress: pipelineProgress,
} = useTransformerPipeline(GteSmall)

const searchTerm = ref('')
const tableName = ref('')
const primaryColumnName = ref('id')

async function search() {
  // generate embeddings
  const embedding = await pipeline(searchTerm.value)
  console.debug(embedding)

  const statement = `SELECT t.*, e.embedding <-> '[${embedding.data.join(',')}]' as distance
FROM ${tableName.value}_embeddings as e
LEFT JOIN ${tableName.value} as t
ON t.${primaryColumnName.value} = e.${primaryColumnName.value}
ORDER BY distance`

  runner.batch([
    {
      sql: statement,
      key: `stmt_auto_${djb2(statement)}`,
    },
  ])
}

const {
  mutate: handleSearch,
  error,
  isPending,
} = useMutation({
  mutationFn: search,
  onSuccess: close,
})
</script>

<template>
  <ResponsiveDialog v-model:open="open">
    <ResponsiveDialogContent>
      <ResponsiveDialogHeader>
        <DialogTitle>Semantic Search</DialogTitle>
        <DialogDescription>
          Search for similar items in your dataset using embeddings.
        </DialogDescription>
      </ResponsiveDialogHeader>
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
      <div v-if="pipelineIsLoading" class="space-y-2">
        <Label>Loading model...</Label>
        <Progress :model-value="pipelineProgress" />
      </div>
      <p v-if="error" class="text-red-500">{{ error }}</p>
      <ResponsiveDialogFooter>
        <Button @click="handleSearch" :disabled="isPending" class="gap-3">
          <LoaderCircleIcon
            v-if="isPending"
            class="size-4 min-w-max animate-spin"
          />
          <SearchIcon v-else class="size-4 min-w-max" />
          <span>Search</span>
        </Button>
      </ResponsiveDialogFooter>
    </ResponsiveDialogContent>
  </ResponsiveDialog>
</template>
