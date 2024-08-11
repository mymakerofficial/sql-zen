<script setup lang="ts">
import DatabaseSelectItemContent from '@/components/shared/databaseEngineSelect/DatabaseSelectItemContent.vue'
import ColorModeSelect from '@/components/shared/ColorModeSelect.vue'
import { useRouter } from 'vue-router'
import { useRegistry } from '@/composables/useRegistry'
import { Button } from '@/components/ui/button'
import { FileAccessor } from '@/lib/files/fileAccessor'
import { simplifyIdentifier } from '@/lib/dataSources/helpers'
import FileInput from '@/components/shared/FileInput.vue'
import { DataSourceMode } from '@/lib/dataSources/enums'
import {
  databaseEngines,
  selectableDatabaseEngines,
} from '@/lib/engines/constants'
import { DatabaseEngine } from '@/lib/engines/enums'

const router = useRouter()
const registry = useRegistry()

function handleSelect(engine: DatabaseEngine) {
  registry.register({
    engine,
    mode: DataSourceMode.Memory,
    identifier: '',
  })
  router.push('/app')
}

async function handleSelectFile(fileAccessor: FileAccessor) {
  const fileName = fileAccessor.getName()
  let engine: DatabaseEngine
  if (fileName.endsWith('.sqlite') || fileName.endsWith('.sqlite3')) {
    engine = DatabaseEngine.SQLite
  } else if (fileName.endsWith('.tar.gz')) {
    engine = DatabaseEngine.PostgreSQL
  } else {
    throw new Error('Unsupported file type')
  }
  registry.register({
    engine,
    mode: DataSourceMode.Memory,
    identifier: simplifyIdentifier(fileName.split('.')[0]),
    dump: fileAccessor,
  })
  await router.push('/app')
}
</script>

<template>
  <div class="h-screen flex flex-col">
    <div
      class="hidden h-16 px-3 md:flex justify-end items-center border-b border-border"
    >
      <ColorModeSelect />
    </div>
    <main class="flex-1 p-6 md:flex md:items-center md:justify-center">
      <div class="flex flex-col gap-12 lg:w-[32rem]">
        <div class="flex flex-col gap-3">
          <h1 class="text-4xl font-bold leading-10">
            <img
              src="@/assets/sql-zen-logo.svg"
              alt="SqlZen"
              class="inline size-9 mr-3 -mt-1"
            />
            <span
              class="bg-gradient-to-br from-blue-200 to-blue-600 inline-block text-transparent bg-clip-text font-black"
              >SqlZen</span
            >
            lets you play with your favourite databases right in the browser.
          </h1>
        </div>
        <div class="flex flex-col gap-7">
          <p class="text-sm font-medium text-muted-foreground">
            Select a database to get going
          </p>
          <div class="flex flex-col gap-4">
            <Button
              v-for="item in selectableDatabaseEngines"
              @click="() => handleSelect(item.engine)"
              :key="item.engine"
              variant="ghost"
              class="block h-fit text-wrap p-3 hover:bg-accent text-left"
            >
              <DatabaseSelectItemContent
                v-bind="item"
                class="max-w-full md:w-3/4"
              />
            </Button>
          </div>
          <p class="text-sm font-medium text-muted-foreground">
            or
            <FileInput @selected="handleSelectFile">
              <Button variant="link">open database file.</Button>
            </FileInput>
          </p>
        </div>
      </div>
    </main>
  </div>
</template>
