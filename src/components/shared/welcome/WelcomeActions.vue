<script setup lang="ts">
import WelcomeDataSourceItem from '@/components/shared/welcome/WelcomeDataSourceItem.vue'
import DatabaseEngineSelect from '@/components/shared/databaseEngineSelect/DatabaseEngineSelect.vue'
import { PlusIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { useDialog } from '@/composables/useDialog'
import CreateDataSourceDialog from '@/components/shared/dialogs/CreateDataSourceDialog.vue'
import type { DatabaseEngine } from '@/lib/engines/enums'
import { TabType } from '@/lib/tabs/enums'
import { useTabManager } from '@/composables/tabs/useTabManager'
import { useDataSourceKeys } from '@/composables/dataSources/useDataSourceKeys'

const { open: openCreate } = useDialog(CreateDataSourceDialog)
const dataSources = useDataSourceKeys()
const tabManager = useTabManager()

function handleCreate(engine: DatabaseEngine) {
  openCreate({
    engine,
  })
}

function handleSelect(key: string) {
  tabManager.createTab({
    type: TabType.Console,
    dataSourceKey: key,
  })
}
</script>

<template>
  <div class="flex-1 flex flex-col gap-2 max-w-80">
    <DatabaseEngineSelect @select="handleCreate">
      <Button size="sm" variant="ghost" class="gap-3 justify-start">
        <PlusIcon class="size-4 min-h-max" />
        <span>Create Data Source</span>
      </Button>
    </DatabaseEngineSelect>
    <WelcomeDataSourceItem
      v-for="dataSource in dataSources"
      :key="dataSource"
      :data-source-key="dataSource"
      @select="() => handleSelect(dataSource)"
    />
  </div>
</template>
