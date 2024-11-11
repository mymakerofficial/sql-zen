<script setup lang="ts">
import WelcomeDataSourceItem from '@/components/shared/welcome/WelcomeDataSourceItem.vue'
import { PlusIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { useDialog } from '@/composables/useDialog'
import CreateDataSourceDialog from '@/components/shared/dialogs/dataSource/CreateDataSourceDialog.vue'
import { TabType } from '@/lib/tabs/enums'
import { useTabManager } from '@/composables/tabs/useTabManager'
import { useDataSourceIds } from '@/composables/dataSources/useDataSourceIds'

const { open: openCreate } = useDialog(CreateDataSourceDialog)
const dataSources = useDataSourceIds()
const tabManager = useTabManager()

function handleSelect(id: string) {
  tabManager.createTab({
    type: TabType.Console,
    dataSourceId: id,
  })
}
</script>

<template>
  <div class="flex-1 flex flex-col gap-2 max-w-80">
    <Button
      @click="openCreate"
      size="sm"
      variant="ghost"
      class="gap-3 justify-start"
    >
      <PlusIcon class="size-4" />
      <span>Create Data Source</span>
    </Button>
    <WelcomeDataSourceItem
      v-for="dataSource in dataSources"
      :key="dataSource"
      :data-source-id="dataSource"
      @select="() => handleSelect(dataSource)"
    />
  </div>
</template>
