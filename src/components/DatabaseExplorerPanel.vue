<script setup lang="ts">
import { DatabaseIcon, FolderIcon } from 'lucide-vue-next'
</script>

<template>
  <section class="py-4 px-6 flex flex-col">
    <div class="flex flex-col gap-4">
      <h2 class="flex gap-3 items-center text-sm ">
        <DatabaseIcon class="size-4 text-muted-foreground" />
        <span class="font-medium">My Database</span>
      </h2>
      <div class="ml-7 flex flex-col gap-4">
        <div class="flex flex-col gap-4">
          <h2 class="flex gap-3 items-center text-sm ">
            <FolderIcon class="size-4 text-muted-foreground" />
            <span class="font-medium">Tables</span>
          </h2>
          <div class="ml-7">
            <p class="text-muted-foreground text-sm">No tables...</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
