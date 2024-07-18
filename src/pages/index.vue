<script setup lang="ts">
import Editor from '@/components/Editor.vue'
import DatabaseSelect from '@/components/DatabaseSelect.vue'
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable'
import { ListVideoIcon, PlusIcon } from 'lucide-vue-next'
</script>

<template>
  <div class="h-screen flex flex-col">
    <nav class="relative h-16 px-3 flex items-center border-b border-border">
      <span class="w-96 h-full absolute left-0 -z-10 bg-gradient-to-r from-blue-500/20 to-blue-500/0" />
      <div class="w-60">
        <DatabaseSelect />
      </div>
    </nav>
    <main class="flex-1 flex flex-col">
      <ResizablePanelGroup direction="horizontal" class="flex-1">
        <ResizablePanel :default-size="16">
          <div class="m-6 text-muted-foreground">tables</div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>
          <section class="h-12 flex items-center border-b border-border">
            <div class="h-full px-6 text-muted-foreground flex gap-3 items-center border-r border-border">
              <ListVideoIcon class="size-4" />
              <span>console</span>
            </div>
            <div class="h-full px-6 text-muted-foreground flex gap-3 items-center border-r border-border">
              <ListVideoIcon class="size-4" />
              <span>console 2</span>
            </div>
            <div class="h-full aspect-square text-muted-foreground flex items-center justify-center">
              <PlusIcon class="size-4" />
            </div>
          </section>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel>
              <Editor />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel :default-size="24">
              <div class="m-6 text-muted-foreground">result</div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  </div>
</template>