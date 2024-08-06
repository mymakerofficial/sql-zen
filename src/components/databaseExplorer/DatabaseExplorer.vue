<script setup lang="ts">
import { PlusIcon, RefreshCwIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import DatabaseEngineSelect from '@/components/shared/databaseEngineSelect/DatabaseEngineSelect.vue'
import { useDialog } from '@/composables/useDialog'
import CreateDataSourceDialog from '@/components/shared/dialogs/CreateDataSourceDialog.vue'
import { useQueryClient } from '@tanstack/vue-query'
import type { DatabaseEngine } from '@/lib/engines/enums'
import DatabaseExplorerContent from '@/components/databaseExplorer/DatabaseExplorerContent.vue'

const selected = defineModel<string | null>('selected', {
  required: true,
  default: null,
})

const { open: openCreate } = useDialog(CreateDataSourceDialog)
const queryClient = useQueryClient()

function handleCreate(engine: DatabaseEngine) {
  openCreate({
    engine,
  })
}

function handleRefresh() {
  queryClient.invalidateQueries({
    queryKey: ['schemaTree'],
  })
}
</script>

<template>
  <section class="flex-1 flex flex-col h-full">
    <div
      class="px-3 h-12 flex items-center justify-between border-b border-border"
    >
      <DatabaseEngineSelect @select="handleCreate">
        <Button size="sm" variant="ghost" class="gap-3">
          <PlusIcon class="size-4 min-w-max" />
          <span>Add Data Source</span>
        </Button>
      </DatabaseEngineSelect>
      <Button @click="handleRefresh" size="sm" variant="ghost">
        <RefreshCwIcon class="size-4 min-w-max" />
      </Button>
    </div>
    <DatabaseExplorerContent v-model:selected="selected" />
  </section>
</template>
