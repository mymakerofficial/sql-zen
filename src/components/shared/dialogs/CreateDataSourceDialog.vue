<script setup lang="ts">
import { useDialogContext } from '@/composables/useDialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { computed, ref } from 'vue'
import DataSourceModeSelect from '@/components/shared/DataSourceModeSelect.vue'
import { useRegistry } from '@/composables/useRegistry'
import { useMutation } from '@tanstack/vue-query'
import DatabaseEngineSelect from '@/components/shared/databaseEngineSelect/DatabaseEngineSelect.vue'
import { FileAccessor } from '@/lib/files/fileAccessor'
import { Separator } from '@/components/ui/separator'
import { whenever } from '@vueuse/core'
import FileInput from '@/components/shared/FileInput.vue'
import { DatabaseEngine, DatabaseEngineCapability } from '@/lib/engines/enums'
import { DataSourceMode } from '@/lib/dataSources/enums'
import ResponsiveDialog from '@/components/shared/responsiveDialog/ResponsiveDialog.vue'
import ResponsiveDialogContent from '@/components/shared/responsiveDialog/ResponsiveDialogContent.vue'
import ResponsiveDialogFooter from '@/components/shared/responsiveDialog/ResponsiveDialogFooter.vue'
import ResponsiveDialogHeader from '@/components/shared/responsiveDialog/ResponsiveDialogHeader.vue'
import ResponsiveDialogTitle from '@/components/shared/responsiveDialog/ResponsiveDialogTitle.vue'
import ResponsiveDialogDescription from '@/components/shared/responsiveDialog/ResponsiveDialogDescription.vue'
import type { DataSourceData } from '@/lib/dataSources/types'
import { useEngineSupports } from '@/composables/engines/useEngineSupports'

const props = withDefaults(
  defineProps<{
    engine?: DatabaseEngine
  }>(),
  {
    engine: DatabaseEngine.PostgreSQL,
  },
)

const { close, open } = useDialogContext()
const registry = useRegistry()

const engine = ref<DatabaseEngine>(props.engine)
const identifier = ref<string>('')
const mode = ref<DataSourceMode>(DataSourceMode.Memory)
const dump = ref<FileAccessor | null>(null)

whenever(dump, () => {
  if (dump.value) {
    identifier.value = dump.value.getName().split('.')[0]
  }
})

const disableMode = computed(() => {
  return engine.value === DatabaseEngine.DuckDB
})

const disableIdentifier = computed(() => {
  return (
    engine.value === DatabaseEngine.DuckDB ||
    (engine.value === DatabaseEngine.SQLite &&
      mode.value === DataSourceMode.BrowserPersisted)
  )
})

const enableDump = useEngineSupports(
  engine,
  DatabaseEngineCapability.ImportDump,
)

async function handleFileSelected(value: FileAccessor) {
  dump.value = value
}

const { mutate: create, error } = useMutation({
  mutationFn: () => {
    const data: DataSourceData = {
      engine: engine.value,
      mode: mode.value,
      identifier: identifier.value,
      dump: dump.value,
    }

    if (disableMode.value) {
      data.mode = DataSourceMode.Memory
    }

    if (disableIdentifier.value) {
      data.identifier = ''
    }

    if (!enableDump.value) {
      data.dump = null
    }

    registry.register(data)

    return Promise.resolve()
  },
  onSuccess: close,
})
</script>

<template>
  <ResponsiveDialog v-model:open="open">
    <ResponsiveDialogContent>
      <ResponsiveDialogHeader>
        <ResponsiveDialogTitle>Create new Data Source.</ResponsiveDialogTitle>
        <ResponsiveDialogDescription>
          Different databases may support different configurations.
        </ResponsiveDialogDescription>
      </ResponsiveDialogHeader>
      <div class="grid gap-4 py-4 mx-4 md:mx-0">
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="engine" class="text-right">Engine</Label>
          <DatabaseEngineSelect
            v-model="engine"
            id="engine"
            class="col-span-3"
          />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="mode" class="text-right">Storage Mode</Label>
          <DataSourceModeSelect
            v-model="mode"
            :disabled="disableMode"
            id="mode"
            class="col-span-3"
          />
          <p
            v-if="disableMode"
            class="col-span-full text-sm text-muted-foreground"
          >
            This database engine only supports in memory storage.
          </p>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="identifier" class="text-right">Identifier</Label>
          <Input
            v-model="identifier"
            :disabled="disableIdentifier"
            placeholder="my-awesome-database"
            id="identifier"
            class="col-span-3"
          />
          <p
            v-if="disableIdentifier"
            class="col-span-full text-sm text-muted-foreground"
          >
            Only one database can be crate with this configuration.
          </p>
        </div>
        <Separator />
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="file" class="text-right">Import Dump</Label>
          <FileInput @selected="handleFileSelected">
            <Button
              :disabled="!enableDump"
              id="file"
              variant="outline"
              class="col-span-3"
            >
              {{ dump?.getName() ?? 'Select File' }}
            </Button>
          </FileInput>
          <p
            v-if="!enableDump"
            class="col-span-full text-sm text-muted-foreground"
          >
            Only SQLite and PostgreSQL databases can be imported.
          </p>
        </div>
      </div>
      <div v-if="error" class="text-red-500 text-sm mt-2">
        {{ error.message }}
      </div>
      <ResponsiveDialogFooter>
        <Button @click="close" variant="ghost">Cancel</Button>
        <Button @click="create" type="submit">Create</Button>
      </ResponsiveDialogFooter>
    </ResponsiveDialogContent>
  </ResponsiveDialog>
</template>
