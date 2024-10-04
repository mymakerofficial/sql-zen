<script setup lang="ts">
import { useDialogContext } from '@/composables/useDialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { computed, reactive, watchEffect } from 'vue'
import DataSourceModeSelect from '@/components/shared/dataSourceModeSelect/DataSourceModeSelect.vue'
import { useRegistry } from '@/composables/useRegistry'
import { useMutation } from '@tanstack/vue-query'
import DatabaseEngineSelect from '@/components/shared/databaseEngineSelect/DatabaseEngineSelect.vue'
import { FileAccessor } from '@/lib/files/fileAccessor'
import { Separator } from '@/components/ui/separator'
import FileInput from '@/components/shared/FileInput.vue'
import {
  DatabaseEngine,
  DataSourceDriver,
  DataSourceDriverCapability,
} from '@/lib/engines/enums'
import { DataSourceMode } from '@/lib/dataSources/enums'
import ResponsiveDialog from '@/components/shared/responsiveDialog/ResponsiveDialog.vue'
import ResponsiveDialogContent from '@/components/shared/responsiveDialog/ResponsiveDialogContent.vue'
import ResponsiveDialogFooter from '@/components/shared/responsiveDialog/ResponsiveDialogFooter.vue'
import ResponsiveDialogHeader from '@/components/shared/responsiveDialog/ResponsiveDialogHeader.vue'
import ResponsiveDialogTitle from '@/components/shared/responsiveDialog/ResponsiveDialogTitle.vue'
import ResponsiveDialogDescription from '@/components/shared/responsiveDialog/ResponsiveDialogDescription.vue'
import type { DataSourceData } from '@/lib/dataSources/types'
import { getEngineInfo } from '@/lib/engines/helpers'
import DataSourceDriverSelect from '@/components/shared/dataSourceDriverSelect/DataSourceDriverSelect.vue'
import { useDriverSupports } from '@/composables/engines/useDriverSupports'
import { isTauri } from '@tauri-apps/api/core'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AppWindowIcon } from 'lucide-vue-next'

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

const data = reactive<DataSourceData>({
  engine: props.engine,
  driver: getEngineInfo(props.engine).defaultDriver,
  mode: DataSourceMode.Memory,
  displayName: '',
  connectionString: '',
  fileAccessor: FileAccessor.Dummy,
})

watchEffect(() => {
  data.displayName = getEngineInfo(data.engine).name
})

watchEffect(() => {
  switch (data.driver) {
    case DataSourceDriver.PGLite:
      if (data.mode === DataSourceMode.BrowserPersisted) {
        data.connectionString = 'idb://identifier'
      } else {
        data.connectionString = 'memory://identifier'
      }
      break
    case DataSourceDriver.PostgreSQL:
      data.connectionString = 'postgres://user:password@host:port/database'
      break
    default:
      data.connectionString = ''
      break
  }
})

const enableDump = useDriverSupports(
  () => data.driver,
  DataSourceDriverCapability.ImportDump,
)

const enableConnectionString = useDriverSupports(
  () => data.driver,
  DataSourceDriverCapability.ConnectionString,
)

const enableMode = useDriverSupports(
  () => data.driver,
  DataSourceDriverCapability.Mode,
)

const requiresDesktop = useDriverSupports(
  () => data.driver,
  DataSourceDriverCapability.RequiresDesktopApp,
)

const showRequiresDesktop = computed(() => {
  return requiresDesktop.value && !isTauri()
})

async function handleFileSelected(value: FileAccessor) {
  data.fileAccessor = value
}

const { mutate: create, error } = useMutation({
  mutationFn: () => {
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
        <ResponsiveDialogTitle>Create new Data Source</ResponsiveDialogTitle>
        <ResponsiveDialogDescription>
          Add a new database connection to your workspace.
        </ResponsiveDialogDescription>
      </ResponsiveDialogHeader>
      <div class="grid gap-4 py-4 mx-4 md:mx-0">
        <div class="grid grid-cols-4 items-center gap-x-4 gap-y-2">
          <Label for="identifier" class="text-right">Display Name</Label>
          <Input
            v-model="data.displayName"
            id="displayName"
            class="col-span-3"
          />
        </div>
        <Separator />
        <div class="grid grid-cols-4 items-center gap-x-4 gap-y-2">
          <Label for="engine" class="text-right">Engine</Label>
          <DatabaseEngineSelect
            v-model="data.engine"
            id="engine"
            class="col-span-3"
          />
        </div>
        <div class="grid grid-cols-4 items-center gap-x-4 gap-y-2">
          <Label for="engine" class="text-right">Driver</Label>
          <DataSourceDriverSelect
            v-model="data.driver"
            :engine="data.engine"
            id="driver"
            class="col-span-3"
          />
          <p class="col-span-3 col-start-2 text-xs text-muted-foreground">
            The driver changes how to connect and what features are available.
          </p>
        </div>
        <div
          v-if="enableMode"
          class="grid grid-cols-4 items-center gap-x-4 gap-y-2"
        >
          <Label for="mode" class="text-right">Mode</Label>
          <DataSourceModeSelect
            v-model="data.mode"
            id="mode"
            class="col-span-3"
          />
        </div>
        <Separator />
        <div
          v-if="enableConnectionString"
          class="grid grid-cols-4 items-center gap-4"
        >
          <Label for="identifier" class="text-right">URL</Label>
          <Input
            v-model="data.connectionString"
            id="connectionString"
            class="col-span-3"
          />
          <p class="col-span-3 col-start-2 text-xs text-muted-foreground">
            The connection string used to connect to the database.
          </p>
        </div>
        <div v-if="enableDump" class="grid grid-cols-4 items-center gap-4">
          <Label for="file" class="text-right">Import Dump</Label>
          <FileInput @selected="handleFileSelected">
            <Button
              :disabled="!enableDump"
              id="file"
              variant="outline"
              class="col-span-3"
            >
              {{
                data.fileAccessor.getOrUndefined()?.getName() ?? 'Select File'
              }}
            </Button>
          </FileInput>
          <p class="col-span-3 col-start-2 text-xs text-muted-foreground">
            The dump file to create the database from.
          </p>
        </div>
      </div>
      <Alert v-if="showRequiresDesktop">
        <AppWindowIcon class="size-4 min-h-max" />
        <AlertTitle>Ready for more?</AlertTitle>
        <AlertDescription>
          This driver only works with the desktop app.
        </AlertDescription>
      </Alert>
      <div v-if="error" class="text-red-500 text-sm mt-2">
        {{ error.message }}
      </div>
      <ResponsiveDialogFooter>
        <Button @click="close" variant="ghost">Cancel</Button>
        <Button :disabled="showRequiresDesktop" @click="create" type="submit"
          >Create</Button
        >
      </ResponsiveDialogFooter>
    </ResponsiveDialogContent>
  </ResponsiveDialog>
</template>
