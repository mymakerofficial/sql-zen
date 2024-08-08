<script setup lang="ts">
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import {
  BrainIcon,
  DownloadIcon,
  FileIcon,
  FolderIcon,
  SearchIcon,
  SparklesIcon,
} from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { useDialog } from '@/composables/useDialog'
import FileExplorer from '@/components/shared/dialogs/fileExplorer/FileExplorer.vue'
import EmbeddingsDialog from '@/components/shared/dialogs/embeddings/EmbeddingsDialog.vue'
import EmbeddingsSearchDialog from '@/components/shared/dialogs/embeddings/EmbeddingsSearchDialog.vue'
import { computed } from 'vue'
import { DatabaseEngine } from '@/lib/engines/enums'
import { downloadFile } from '@/lib/downloadFile'
import { useRegistry } from '@/composables/useRegistry'
import { useDataSourceDescriptor } from '@/composables/useDataSourceDescriptor'

const props = defineProps<{
  dataSource: string | null
}>()

const registry = useRegistry()

const descriptor = useDataSourceDescriptor(() => props.dataSource)

const { open: openFileExplorer } = useDialog(FileExplorer)
const { open: openEmbeddings } = useDialog(EmbeddingsDialog)
const { open: openEmbeddingsSearch } = useDialog(EmbeddingsSearchDialog)

const supportsFileExplorer = computed(
  () => descriptor.value?.engine !== DatabaseEngine.SQLite,
)

const supportsDatabaseDump = computed(
  () => descriptor.value?.engine !== DatabaseEngine.DuckDB,
)

const supportsEmbeddings = computed(
  () => descriptor.value?.engine === DatabaseEngine.PostgreSQL,
)

function handleOpenFileExplorer() {
  if (!props.dataSource) {
    return
  }
  openFileExplorer({ dataSourceKey: props.dataSource })
}

function handleOpenEmbeddings() {
  if (!props.dataSource) {
    return
  }
  openEmbeddings({ dataSourceKey: props.dataSource })
}

function handleOpenEmbeddingsSearch() {
  if (!props.dataSource) {
    return
  }
  openEmbeddingsSearch({ dataSourceKey: props.dataSource })
}

async function handleDump() {
  if (!props.dataSource) {
    return
  }
  const dump = await registry.getDataSource(props.dataSource).dump()
  downloadFile(dump)
}
</script>

<template>
  <NavigationMenu>
    <NavigationMenuList>
      <NavigationMenuItem>
        <NavigationMenuTrigger class="gap-3">
          <FileIcon class="size-4 min-w-max" />
          <span class="hidden md:block">Files</span>
        </NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul class="grid w-[200px] p-2 md:w-[300px]">
            <NavigationMenuLink as-child>
              <Button
                @click="handleOpenFileExplorer"
                :disabled="!supportsFileExplorer"
                variant="ghost"
                class="justify-start gap-3"
              >
                <FolderIcon class="size-4 min-w-max" />
                <span class="text-sm font-medium leading-none">
                  Explore Files
                </span>
              </Button>
            </NavigationMenuLink>
            <NavigationMenuLink as-child>
              <Button
                @click="handleDump"
                :disabled="!supportsDatabaseDump"
                variant="ghost"
                class="justify-start gap-3"
              >
                <DownloadIcon class="size-4 min-w-max" />
                <span class="text-sm font-medium leading-none">
                  Download Dump
                </span>
              </Button>
            </NavigationMenuLink>
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuTrigger class="gap-3">
          <SparklesIcon class="size-4 min-w-max text-purple-300" />
          <span
            class="hidden md:block font-bold bg-gradient-to-br from-purple-300 to-violet-200 text-transparent bg-clip-text"
            >Embeddings</span
          >
        </NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul class="grid w-[200px] p-2 md:w-[300px]">
            <NavigationMenuLink as-child>
              <Button
                @click="handleOpenEmbeddingsSearch"
                :disabled="!supportsEmbeddings"
                variant="ghost"
                class="justify-start gap-3"
              >
                <SearchIcon class="size-4 min-w-max" />
                <span class="text-sm font-medium leading-none"
                  >Semantic Search</span
                >
              </Button>
            </NavigationMenuLink>
            <NavigationMenuLink as-child>
              <Button
                @click="handleOpenEmbeddings"
                :disabled="!supportsEmbeddings"
                variant="ghost"
                class="justify-start gap-3"
              >
                <BrainIcon class="size-4 min-w-max" />
                <span class="text-sm font-medium leading-none">
                  Generate Embeddings
                </span>
              </Button>
            </NavigationMenuLink>
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenu>
</template>
