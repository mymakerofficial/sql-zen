<script setup lang="ts">
import { useRegistry } from '@/composables/useRegistry'
import { useDialogContext } from '@/composables/useDialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { ref } from 'vue'
import { env } from '@xenova/transformers'
import { LoaderCircleIcon, SearchIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { useMutation, useQuery } from '@tanstack/vue-query'
import { useTransformerPipeline } from '@/composables/transformers/useTransformerPipeline'
import { Progress } from '@/components/ui/progress'
import { GteSmall } from '@/lib/transformers/singletons/gteSmall'
import ResponsiveDialogFooter from '@/components/shared/responsiveDialog/ResponsiveDialogFooter.vue'
import ResponsiveDialog from '@/components/shared/responsiveDialog/ResponsiveDialog.vue'
import ResponsiveDialogContent from '@/components/shared/responsiveDialog/ResponsiveDialogContent.vue'
import ResponsiveDialogHeader from '@/components/shared/responsiveDialog/ResponsiveDialogHeader.vue'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { djb2 } from '@/lib/hash'
import { useSeline } from '@/composables/seline/seline'

env.allowLocalModels = false

const props = defineProps<{
  dataSourceKey: string
}>()

const { track } = useSeline()

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

const { data: tables } = useQuery({
  queryKey: [runner.key, 'tables'],
  queryFn: async () => {
    const allTables = await runner.dataSource.dialect.getTableNames()
    const filteredTables = allTables.filter(
      (table) =>
        !table.endsWith('_embeddings') &&
        allTables.includes(`${table}_embeddings`),
    )
    if (filteredTables.length > 0) {
      tableName.value = filteredTables[0]
    }
    return filteredTables
  },
  initialData: [],
})

const { data: columns } = useQuery({
  queryKey: [runner.key, tableName, 'columns'],
  queryFn: () =>
    runner.dataSource.dialect
      .getTableColumnDefinitions({
        name: tableName.value,
      })
      .then((data) => data.map((column) => column.getInfo())),
  initialData: [],
})

async function search() {
  // generate embeddings
  const embedding = await pipeline(searchTerm.value)
  console.debug(embedding)

  const columnsSql = columns.value
    .map((column) => `t.${column.name}`)
    .join(',\n    ')
  const statement = `SELECT
    ${columnsSql},
    e.embedding <-> '[${embedding.data.join(',')}]' as distance
FROM ${tableName.value}_embeddings as e
LEFT JOIN ${tableName.value} as t
ON t.${primaryColumnName.value} = e.${primaryColumnName.value}
ORDER BY distance`

  await runner.asyncBatch([
    {
      sql: statement,
      key: `stmt_auto_${djb2(statement)}`,
    },
  ])

  track('embeddings: search', {
    ...runner.dataSource.getAnonymizedAnalyticsData(),
    searchTermHash: djb2(searchTerm.value),
  })
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
          <Label for="tableName" class="text-right">Table</Label>
          <Select v-model="tableName" :disabled="isPending" id="tableName">
            <SelectTrigger class="col-span-3">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem v-for="table in tables" :value="table" :key="table">
                  {{ table }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="primaryColumnName" class="text-right"
            >Primary Column</Label
          >
          <Select
            v-model="primaryColumnName"
            :disabled="isPending"
            id="primaryColumnName"
          >
            <SelectTrigger class="col-span-3">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem
                  v-for="column in columns"
                  :value="column.name"
                  :key="column.name"
                >
                  {{ column.name }} {{ column.dataType }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
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
            class="size-4 min-h-max animate-spin"
          />
          <SearchIcon v-else class="size-4 min-h-max" />
          <span>Search</span>
        </Button>
      </ResponsiveDialogFooter>
    </ResponsiveDialogContent>
  </ResponsiveDialog>
</template>
