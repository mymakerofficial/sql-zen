<script setup lang="ts">
import DatabaseSelectItemContent from '@/components/shared/databaseEngineSelect/DatabaseSelectItemContent.vue'
import { DatabaseEngine, databaseEnginesList } from '@/lib/databaseEngines'
import ColorModeSelect from '@/components/shared/ColorModeSelect.vue'
import { useRouter } from 'vue-router'
import { useRegistry } from '@/composables/useRegistry'
import { DatabaseEngineMode } from '@/lib/databases/database'
import { Button } from '@/components/ui/button'
import { FileAccessor } from '@/lib/files/fileAccessor'
import { simplifyIdentifier } from '@/lib/simplifyIdentifier'

const router = useRouter()
const registry = useRegistry()

function handleSelect(engine: DatabaseEngine) {
  registry.registerIfNotExists({
    engine,
    mode: DatabaseEngineMode.Memory,
    identifier: null,
    fileAccessor: null,
  })
  router.push('/app')
}

async function handleSelectFile() {
  // @ts-ignore experimental
  const [fileHandle] = await window.showOpenFilePicker()
  const fileAccessor = FileAccessor.fromFileSystemFileHandle(fileHandle)
  const fileName = fileAccessor.getName()
  console.log(fileName)
  let engine: DatabaseEngine
  if (fileName.endsWith('.sqlite') || fileName.endsWith('.sqlite3')) {
    engine = DatabaseEngine.SQLite
  } else if (fileName.endsWith('.tar.gz')) {
    engine = DatabaseEngine.PostgreSQL
  } else {
    throw new Error('Unsupported file type')
  }
  registry.registerIfNotExists({
    engine,
    mode: DatabaseEngineMode.Memory,
    identifier: simplifyIdentifier(fileName.split('.')[0]),
    fileAccessor,
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
          <h1 class="text-4xl font-bold">
            <span
              class="bg-gradient-to-br from-primary to-blue-600 inline-block text-transparent bg-clip-text font-black"
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
              v-for="item in databaseEnginesList"
              @click="() => handleSelect(item.key)"
              :key="item.key"
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
            <Button @click="handleSelectFile" variant="link"
              >open database file.</Button
            >
          </p>
        </div>
      </div>
    </main>
  </div>
</template>
