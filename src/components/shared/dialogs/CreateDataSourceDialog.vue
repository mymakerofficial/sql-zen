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
import { AppWindowIcon, FlaskConicalIcon, InfoIcon } from 'lucide-vue-next'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

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
  identifier: '',
  connectionString: '',
  fileAccessor: FileAccessor.Dummy,
})

const adjectives = [
  'awesome',
  'great',
  'amazing',
  'fantastic',
  'wonderful',
  'incredible',
]

const nouns = [
  'squirrel',
  'bean',
  'database',
  'duck',
  'elephant',
  'penguin',
  'whale',
]

watchEffect(
  () => {
    switch (data.driver) {
      case DataSourceDriver.PostgreSQL:
        data.connectionString =
          'postgres://user:password@localhost:5432/postgres'
        break
      case DataSourceDriver.MySQL:
        data.connectionString = 'mysql://user:password@localhost:3306/mysql'
        break
      default:
        data.connectionString = ''
        break
    }

    if (data.driver === DataSourceDriver.SQLiteWASM && data.mode === DataSourceMode.Persisted) {
      data.identifier = ''
      return
    }

    if (
      data.driver === DataSourceDriver.SQLiteWASM ||
      data.driver === DataSourceDriver.PGLite
    ) {
      if (data.fileAccessor.isDummy) {
        const fileName = data.fileAccessor
          .getOrUndefined()
          ?.getName()
          .split('.')[0]
        const randomAdjective =
          adjectives[Math.floor(Math.random() * adjectives.length)]
        const randomNoun = nouns[Math.floor(Math.random() * nouns.length)]

        data.identifier =
          fileName ?? [randomAdjective, data.engine, randomNoun].join('-')
      } else {
        data.identifier = data.fileAccessor.getName().split('.')[0]
      }
    } else {
      data.identifier = ''
    }
  },
  {
    flush: 'post',
  },
)

watchEffect(
  () => {
    if (
      data.driver === DataSourceDriver.PostgreSQL ||
      data.driver === DataSourceDriver.MySQL
    ) {
      const parts = data.connectionString.match(
        /:\/\/(.*):(.*)@(.*):(.*)\/(.*)/,
      )
      const host = parts?.[3]
      const database = parts?.[5]

      if (!host || !database) {
        data.displayName = getEngineInfo(data.engine).name
        return
      }

      data.displayName = [database, host].join('@')
    } else {
      data.displayName = getEngineInfo(data.engine).name
    }
  },
  {
    flush: 'post',
  },
)

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

const enableIdentifier = useDriverSupports(
  () => data.driver,
  DataSourceDriverCapability.Identifier,
)

const requiresDesktop = useDriverSupports(
  () => data.driver,
  DataSourceDriverCapability.RequiresDesktopApp,
)

const worksInBrowser = useDriverSupports(
  () => data.driver,
  DataSourceDriverCapability.WorksInBrowser,
)

const isExperimental = useDriverSupports(
  () => data.driver,
  DataSourceDriverCapability.Experimental,
)

const showRequiresDesktop = computed(() => {
  return requiresDesktop.value && !isTauri()
})

const canCreate = computed(() => {
  return !showRequiresDesktop.value
})

// special sqlite wasm case
const showOnlyOnePersistedWarning = computed(() => {
  return (
    data.driver === DataSourceDriver.SQLiteWASM &&
    data.mode === DataSourceMode.BrowserPersisted
  )
})

const engineInfo = computed(() => getEngineInfo(data.engine))

async function handleFileSelected(value: FileAccessor) {
  data.fileAccessor = value
  data.identifier = value.getName().split('.')[0]
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
      <div class="overflow-y-auto flex flex-col gap-2">
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
            <Label for="engine" class="text-right">
              <Tooltip>
                <TooltipTrigger>DBMS</TooltipTrigger>
                <TooltipContent>Database Management System</TooltipContent>
              </Tooltip>
            </Label>
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
          <Separator />
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
          <div
            v-if="enableIdentifier && !showOnlyOnePersistedWarning"
            class="grid grid-cols-4 items-center gap-4"
          >
            <Label for="identifier" class="text-right">Identifier</Label>
            <Input
              v-model="data.identifier"
              id="identifier"
              class="col-span-3"
            />
            <p class="col-span-3 col-start-2 text-xs text-muted-foreground">
              The identifier is used to uniquely identify the database.
            </p>
          </div>
          <div
            v-if="enableConnectionString"
            class="grid grid-cols-4 items-center gap-4"
          >
            <Label for="connectionString" class="text-right">URL</Label>
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
              <template v-if="data.driver === DataSourceDriver.SQLiteWASM">
                You can open any SQLite file like .db, .sqlite, or .sqlite3.
              </template>
              <template v-if="data.driver === DataSourceDriver.PGLite">
                Upload a .tar.gz file containing a PostgreSQL data directory.
                This feature is only designed to import dumps created by PGLite.
              </template>
            </p>
          </div>
        </div>
        <div v-if="error" class="mx-4 md:mx-0 text-red-500 text-sm mt-2">
          {{ error.message }}
        </div>
        <div
          v-if="showRequiresDesktop"
          class="mx-4 md:mx-0 bg-gradient-to-br from-blue-300 to-blue-600 p-4 rounded-md flex gap-3 text-neutral-900 text-xs"
        >
          <AppWindowIcon class="size-5 mt-1" />
          <div class="space-y-1">
            <p class="text-lg font-bold">Ready for more?</p>
            <p class="font-medium">
              This driver only works using the desktop app of SqlZen.
            </p>
          </div>
        </div>
        <div
          v-if="canCreate && showOnlyOnePersistedWarning"
          class="mx-4 md:mx-0 bg-yellow-400/10 p-2 rounded-md space-y-1"
        >
          <span
            class="flex items-center gap-2 text-sm font-medium text-amber-400"
          >
            <InfoIcon class="size-4 min-w-max" />
            <span>Watch out!</span>
          </span>
          <p class="ml-8 text-xs text-amber-500/80">
            Due to technical limitations of the sqlite-wasm library you can
            only create one persisted sqlite data source.
          </p>
        </div>
        <div
          v-if="canCreate && isExperimental"
          class="mx-4 md:mx-0 bg-yellow-400/10 p-2 rounded-md space-y-1"
        >
          <span
            class="flex items-center gap-2 text-sm font-medium text-amber-400"
          >
            <FlaskConicalIcon class="size-4 min-w-max" />
            <span>Experimental</span>
          </span>
          <p class="ml-8 text-xs text-amber-500/80">
            Support for {{ engineInfo.name }} is still in it's early stages.
            Expect bugs and missing features.
          </p>
        </div>
        <div
          v-if="canCreate"
          class="mx-4 md:mx-0 bg-foreground/10 p-2 rounded-md flex gap-2 text-muted-foreground text-xs"
        >
          <InfoIcon class="size-4 min-w-max" />
          <p>
            <template v-if="worksInBrowser">
              This database lives in your browser. No data is ever sent to our
              servers.
            </template>
            <template v-else>No data is ever sent to our servers.</template>
          </p>
        </div>
      </div>
      <ResponsiveDialogFooter>
        <Button @click="close" variant="ghost">Cancel</Button>
        <Button :disabled="!canCreate" @click="create" type="submit"
          >Create</Button
        >
      </ResponsiveDialogFooter>
    </ResponsiveDialogContent>
  </ResponsiveDialog>
</template>
