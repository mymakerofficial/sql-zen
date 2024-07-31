<script setup lang="ts">
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import DatabaseExplorerPanel from '@/components/databaseExplorer/DatabaseExplorer.vue'
import Console from '@/components/console/Console.vue'
import { ref } from 'vue'
import { useDataSources } from '@/composables/useDataSources'
import { useMediaQuery, whenever } from '@vueuse/core'
import { useRegistry } from '@/composables/useRegistry'
import EditorLayout from '@/layouts/EditorLayout.vue'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { MenuIcon } from 'lucide-vue-next'

const useSheet = useMediaQuery('(max-width: 640px)') // sm

const selected = ref<string | null>(null)

const registry = useRegistry()
const databases = useDataSources()

whenever(
  () => databases.value.length === 1,
  () => {
    const key = databases.value[0]
    registry.start(key)
    selected.value = key
  },
  { immediate: true },
)
</script>

<template>
  <EditorLayout>
    <template #header v-if="useSheet">
      <Sheet>
        <SheetTrigger>
          <Button size="sm" variant="ghost">
            <MenuIcon class="size-4 min-w-max" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" class="p-0 pt-14">
          <DatabaseExplorerPanel v-model:selected="selected" />
        </SheetContent>
      </Sheet>
    </template>
    <ResizablePanelGroup direction="horizontal">
      <template v-if="!useSheet">
        <ResizablePanel :default-size="18">
          <DatabaseExplorerPanel v-model:selected="selected" />
        </ResizablePanel>
        <ResizableHandle />
      </template>
      <ResizablePanel>
        <KeepAlive v-if="selected">
          <Console :data-source-key="selected" :key="selected" />
        </KeepAlive>
        <div
          v-if="!selected"
          class="flex items-center justify-center h-full text-muted-foreground"
        >
          <p v-if="databases.length">
            Select a data source from the list to start querying
          </p>
          <p v-else>Create a data source to start querying</p>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  </EditorLayout>
</template>
