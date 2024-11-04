<script setup lang="ts">
import { PlusIcon, RefreshCwIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { useDialog } from '@/composables/useDialog'
import CreateDataSourceDialog from '@/components/shared/dialogs/dataSource/CreateDataSourceDialog.vue'
import { useQueryClient } from '@tanstack/vue-query'
import DatabaseExplorerContent from '@/components/databaseExplorer/DatabaseExplorerContent.vue'

const { open: openCreate } = useDialog(CreateDataSourceDialog)
const queryClient = useQueryClient()

function handleRefresh() {
  queryClient.invalidateQueries({
    queryKey: ['schemaTree'],
  })
}
</script>

<template>
  <section class="flex flex-col">
    <div
      class="px-3 h-12 flex items-center justify-between border-b border-border"
    >
      <Button
        @click="openCreate"
        size="sm"
        variant="ghost"
        class="justify-start gap-3 flex-grow"
      >
        <PlusIcon class="size-4" />
        <span>Add Data Source</span>
      </Button>
      <Button @click="handleRefresh" size="sm" variant="ghost">
        <RefreshCwIcon class="size-4" />
      </Button>
    </div>
    <DatabaseExplorerContent class="p-3 overflow-y-auto" />
  </section>
</template>
