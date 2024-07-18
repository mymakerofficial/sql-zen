<script setup lang="ts">
import Editor from '@/components/Editor.vue'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { ref } from 'vue'
import ConsoleToolbar from '@/components/ConsoleToolbar.vue'
import DatabaseExplorerPanel from '@/components/DatabaseExplorerPanel.vue'

const result = ref<Array<object>>([])
const query = ref<string>(`-- Welcome to sql-zen\n-- please only write one query for now\nselect 'Hello World!' as message`)

function handleRun() {
  result.value = [{ message: 'Hello World!' }]
}
</script>

<template>
  <div class="h-screen flex flex-col">
    <!-- <AppHeader /> -->
    <main class="flex-1 flex flex-col">
      <ResizablePanelGroup direction="horizontal" class="flex-1">
        <ResizablePanel :default-size="16">
          <DatabaseExplorerPanel />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>
          <ResizablePanelGroup direction="vertical">
            <!-- <Tabs /> -->
            <ResizablePanel>
              <ConsoleToolbar @run="handleRun" />
              <Editor v-model="query" />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel :default-size="24">
              <pre class="m-6 text-muted-foreground">{{ result }}</pre>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  </div>
</template>