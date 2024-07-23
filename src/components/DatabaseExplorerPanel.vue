<script setup lang="ts">
import { FolderIcon, PlusIcon, SettingsIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import DatabaseEngineSelect from '@/components/shared/databaseEngineSelect/DatabaseEngineSelect.vue'
import { databaseEnginesList } from '@/lib/databaseEngines'
</script>

<template>
  <section class="flex flex-col">
    <div class="px-3 h-12 flex items-center border-b border-border">
      <DatabaseEngineSelect>
        <Button size="sm" variant="ghost" class="gap-3">
          <PlusIcon class="size-4" />
          <span>Create Database</span>
        </Button>
      </DatabaseEngineSelect>
    </div>
    <div>
      <div
        v-for="item in databaseEnginesList"
        :key="item.key"
        class="py-4 pl-6 pr-3 flex flex-col gap-4"
      >
        <div class="flex items-center justify-between text-sm">
          <h3 class="flex gap-3 items-center">
            <img
              :src="item.icon"
              :alt="`${item.name} icon`"
              class="size-4 text-muted-foreground"
            />
            <span class="font-medium">{{
              `identifier.${item.name.toLowerCase()}`
            }}</span>
          </h3>
          <div class="flex items-center">
            <Button size="xs" variant="ghost" class="gap-3">
              <SettingsIcon class="size-4" />
            </Button>
          </div>
        </div>
        <div class="ml-7 flex flex-col gap-4">
          <div class="flex flex-col gap-4">
            <h2 class="flex gap-3 items-center text-sm">
              <FolderIcon class="size-4 text-muted-foreground" />
              <span class="font-medium">Tables</span>
            </h2>
            <div class="ml-7">
              <p class="text-muted-foreground text-sm">No tables...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
