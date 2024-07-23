<script setup lang="ts">
import { FolderIcon, PlusIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import DatabaseEngineSelect from '@/components/shared/databaseEngineSelect/DatabaseEngineSelect.vue'
import { type DatabaseEngine, databaseEngines } from '@/lib/databaseEngines'
import { type RegisteredDatabase } from '@/lib/registry/registry'
import { useRegisteredDatabases } from '@/composables/useRegisteredDatabases'
import type { DatabaseInfo } from '@/lib/databases/databaseFactory'
import { useRegistry } from '@/composables/useRegistry'
import { useDialog } from '@/composables/useDialog'
import CreateDatabaseDialog from '@/components/shared/dialogs/CreateDatabaseDialog.vue'

const selected = defineModel<string | null>('selected', {
  required: true,
  default: null,
})

const { open: openCreate } = useDialog(CreateDatabaseDialog)
const registry = useRegistry()
const databases = useRegisteredDatabases()

function getEngine(database: DatabaseInfo) {
  return databaseEngines[database.engine]
}

function handleCreate(engine: DatabaseEngine) {
  openCreate({
    engine,
  })
}

function handleSelect(database: RegisteredDatabase) {
  registry.wake(database.key)
  selected.value = database.key
}
</script>

<template>
  <section class="flex flex-col">
    <div class="px-3 h-12 flex items-center border-b border-border">
      <DatabaseEngineSelect @select="handleCreate">
        <Button size="sm" variant="ghost" class="gap-3">
          <PlusIcon class="size-4" />
          <span>Create Database</span>
        </Button>
      </DatabaseEngineSelect>
    </div>
    <div>
      <div
        v-for="database in databases"
        :key="database.key"
        class="py-4 pl-6 pr-3 flex flex-col gap-4"
      >
        <div class="flex items-center justify-between text-sm">
          <Button
            @click="() => handleSelect(database)"
            size="sm"
            variant="ghost"
            class="-ml-3 gap-3 items-center"
          >
            <span class="relative">
              <img
                :src="getEngine(database).icon"
                :alt="`${getEngine(database).name} icon`"
                class="size-4 text-muted-foreground"
              />
              <span
                :data-state="database.state"
                class="block absolute -top-1 -right-1 size-1.5 rounded-full data-[state=ready]:bg-green-500 data-[state=stopped]:bg-red-500"
              />
            </span>
            <span class="font-medium">{{
              `${database.mode}:${database.identifier ?? 'default'}`
            }}</span>
          </Button>
          <div class="flex items-center"></div>
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
