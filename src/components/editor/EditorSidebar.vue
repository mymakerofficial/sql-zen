<script setup lang="ts">
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import LogoButton from '@/components/shared/appHeader/LogoButton.vue'
import { useDialog } from '@/composables/useDialog'
import CreateDataSourceDialog from '@/components/shared/dialogs/dataSource/CreateDataSourceDialog.vue'
import { Button } from '@/components/ui/button'
import DatabaseExplorerContent from '@/components/databaseExplorer/DatabaseExplorerContent.vue'
import { useEnv } from '@/composables/useEnv'
import { cn } from '@/lib/utils'
import AppLogo from '@/components/shared/appHeader/AppLogo.vue'
import {
  BrainIcon,
  DownloadIcon,
  FolderIcon,
  PlusIcon,
  RefreshCwIcon,
  SearchIcon,
} from 'lucide-vue-next'
import { useRegistry } from '@/composables/useRegistry'
import { useActiveDataSourceId } from '@/composables/dataSources/useActiveDataSourceId'
import { useDataSourceInfo } from '@/composables/dataSources/useDataSourceInfo'
import FileExplorer from '@/components/shared/dialogs/fileExplorer/FileExplorer.vue'
import EmbeddingsDialog from '@/components/shared/dialogs/embeddings/EmbeddingsDialog.vue'
import EmbeddingsSearchDialog from '@/components/shared/dialogs/embeddings/EmbeddingsSearchDialog.vue'
import { useDriverSupports } from '@/composables/engines/useDriverSupports'
import { DataSourceDriverCapability } from '@/lib/engines/enums'
import { computed, type MaybeRefOrGetter, ref } from 'vue'
import { useArrayEvery } from '@vueuse/core'
import { DataSourceStatus } from '@/lib/dataSources/enums'
import { Separator } from '@/components/ui/separator'
import { downloadFile } from '@/lib/downloadFile'
import { useQueryClient } from '@tanstack/vue-query'

function useAnd(values: MaybeRefOrGetter<boolean>[]) {
  return useArrayEvery(values, (value) => value)
}

const isOpen = ref(false)
function close() {
  isOpen.value = false
}

const { isMacOS, isTauri } = useEnv()

const queryClient = useQueryClient()
const registry = useRegistry()
const dataSource = useActiveDataSourceId()
const info = useDataSourceInfo(dataSource)

const { open: openCreate } = useDialog(CreateDataSourceDialog)
const { open: openFileExplorer } = useDialog(FileExplorer)
const { open: openEmbeddings } = useDialog(EmbeddingsDialog)
const { open: openEmbeddingsSearch } = useDialog(EmbeddingsSearchDialog)

const isRunning = computed(() => {
  return info.value.status === DataSourceStatus.Running
})

const supportsFileExplorer = useDriverSupports(
  () => info.value.driver,
  DataSourceDriverCapability.LocalFileSystems,
)
const enableFileExplorer = useAnd([isRunning, supportsFileExplorer])

const supportsDatabaseDump = useDriverSupports(
  () => info.value.driver,
  DataSourceDriverCapability.ExportDump,
)
const enableDatabaseDump = useAnd([isRunning, supportsDatabaseDump])

const supportsEmbeddings = useDriverSupports(
  () => info.value.driver,
  DataSourceDriverCapability.Embeddings,
)
const enableEmbeddings = useAnd([isRunning, supportsEmbeddings])

function handleOpenFileExplorer() {
  if (!dataSource.value) {
    return
  }
  close()
  openFileExplorer({ dataSourceId: dataSource.value })
}

function handleOpenEmbeddings() {
  if (!dataSource.value) {
    return
  }
  close()
  openEmbeddings({ dataSourceId: dataSource.value })
}

function handleOpenEmbeddingsSearch() {
  if (!dataSource.value) {
    return
  }
  close()
  openEmbeddingsSearch({ dataSourceId: dataSource.value })
}

async function handleDump() {
  if (!dataSource.value) {
    return
  }
  close()
  const dump = await registry.getDataSource(dataSource.value).dump()
  downloadFile(dump)
}

function handleOpenCreate() {
  close()
  openCreate()
}

function handleRefresh() {
  queryClient.invalidateQueries({
    queryKey: ['schemaTree'],
  })
}
</script>

<template>
  <Sheet v-model:open="isOpen">
    <SheetTrigger><slot /></SheetTrigger>
    <SheetContent side="left" class="h-full flex flex-col">
      <SheetHeader v-if="!isMacOS" class="text-left">
        <SheetTitle>
          <LogoButton v-if="!isTauri" />
          <AppLogo v-else class="ml-3" />
        </SheetTitle>
      </SheetHeader>
      <div
        :class="
          cn('-mx-6 -mb-6 px-6 py-3 overflow-y-auto', isMacOS ? 'pt-7' : '')
        "
      >
        <div class="h-min flex flex-col gap-4">
          <div class="flex flex-col">
            <Button
              v-if="enableFileExplorer"
              @click="handleOpenFileExplorer"
              variant="ghost"
              class="justify-start gap-3"
            >
              <FolderIcon class="size-4" />
              <span class="text-sm font-medium leading-none">
                Explore Files
              </span>
            </Button>
            <Button
              v-if="enableDatabaseDump"
              @click="handleDump"
              variant="ghost"
              class="justify-start gap-3"
            >
              <DownloadIcon class="size-4" />
              <span class="text-sm font-medium leading-none">
                Download Dump
              </span>
            </Button>
            <Button
              v-if="enableEmbeddings"
              @click="handleOpenEmbeddings"
              variant="ghost"
              class="justify-start gap-3"
            >
              <BrainIcon class="size-4" />
              <span class="text-sm font-medium leading-none">
                Generate Embeddings
              </span>
            </Button>
            <Button
              v-if="enableEmbeddings"
              @click="handleOpenEmbeddingsSearch"
              variant="ghost"
              class="justify-start gap-3"
            >
              <SearchIcon class="size-4" />
              <span class="text-sm font-medium leading-none"
                >Semantic Search</span
              >
            </Button>
          </div>
          <Separator />
          <div class="flex justify-between">
            <Button
              @click="handleOpenCreate"
              size="sm"
              variant="ghost"
              class="justify-start gap-3 flex-1"
            >
              <PlusIcon class="size-4" />
              <span>Add Data Source</span>
            </Button>
            <Button
              @click="handleRefresh"
              size="sm"
              variant="ghost"
              class="my-auto"
            >
              <RefreshCwIcon class="size-4" />
            </Button>
          </div>
          <DatabaseExplorerContent class="w-full h-min" />
        </div>
      </div>
    </SheetContent>
  </Sheet>
</template>
