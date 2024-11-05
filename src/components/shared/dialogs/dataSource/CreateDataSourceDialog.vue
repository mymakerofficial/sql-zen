<script setup lang="ts">
import ResponsiveDialogContent from '@/components/shared/responsiveDialog/ResponsiveDialogContent.vue'
import ResponsiveDialogHeader from '@/components/shared/responsiveDialog/ResponsiveDialogHeader.vue'
import ResponsiveDialogTitle from '@/components/shared/responsiveDialog/ResponsiveDialogTitle.vue'
import ResponsiveDialogDescription from '@/components/shared/responsiveDialog/ResponsiveDialogDescription.vue'
import ResponsiveDialog from '@/components/shared/responsiveDialog/ResponsiveDialog.vue'
import { useDialogContext } from '@/composables/useDialog'
import ResponsiveDialogBody from '@/components/shared/responsiveDialog/ResponsiveDialogBody.vue'
import {
  DatabaseEngine,
  DataSourceDriver,
  DataSourceDriverCapability,
} from '@/lib/engines/enums'
import { useForm } from 'vee-validate'
import { DataSourceMode } from '@/lib/dataSources/enums'
import { toTypedSchema } from '@vee-validate/zod'
import LargeDatabaseEngineSelectField from '@/components/shared/dialogs/dataSource/inputs/LargeDatabaseEngineSelectField.vue'
import LargeDataSourceModeSelectField from '@/components/shared/dialogs/dataSource/inputs/LargeDataSourceModeSelectField.vue'
import { computed } from 'vue'
import ResponsiveDialogFooter from '@/components/shared/responsiveDialog/ResponsiveDialogFooter.vue'
import { Button } from '@/components/ui/button'
import InputField from '@/components/shared/dialogs/dataSource/inputs/InputField.vue'
import { getDriverForEngineAndMode, getEngineInfo } from '@/lib/engines/helpers'
import { watchImmediate } from '@vueuse/core'
import BaseField from '@/components/shared/dialogs/dataSource/inputs/BaseField.vue'
import { Separator } from '@/components/ui/separator'
import FileInputField from '@/components/shared/dialogs/dataSource/inputs/FileInputField.vue'
import { dataSourceSchema } from '@/components/shared/dialogs/dataSource/schema'
import FileSelectField from '@/components/shared/dialogs/dataSource/inputs/FileSelectField.vue'
import { useDriverSupports } from '@/composables/engines/useDriverSupports'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  AppWindowIcon,
  DownloadIcon,
  FlaskConicalIcon,
  InfoIcon,
} from 'lucide-vue-next'
import { useEnv } from '@/composables/useEnv'
import { useMutation } from '@tanstack/vue-query'
import { useRegistry } from '@/composables/useRegistry'
import type { DataSourceData } from '@/lib/dataSources/types'
import {
  getDataSourceDefaults,
  getIdentifier,
} from '@/components/shared/dialogs/dataSource/helpers'

const props = defineProps<{
  data?: Partial<DataSourceData>
}>()

const Step = {
  Engine: 1,
  Mode: 2,
  Details: 3,
} as const

const { open, close } = useDialogContext()
const { isTauri, isBrowser } = useEnv()
const registry = useRegistry()

const { mutate: create } = useMutation({
  mutationFn: (data: DataSourceData) => {
    registry.register(data)
    return Promise.resolve()
  },
  onSuccess: close,
})

const { values, handleSubmit, setValues } = useForm<DataSourceData>({
  validationSchema: toTypedSchema(dataSourceSchema),
  initialValues: { ...getDataSourceDefaults(), ...props.data },
})

const step = computed(() => {
  if (values.engine === DatabaseEngine.None) {
    return Step.Engine
  }

  if (values.mode === DataSourceMode.None) {
    return Step.Mode
  }

  return Step.Details
})

watchImmediate([() => values.engine, () => values.mode], () => {
  const driver = getDriverForEngineAndMode(values.engine, values.mode)

  setValues({
    driver,
  })
})

watchImmediate([() => values.engine], ([engine]) => {
  const engineInfo = getEngineInfo(engine)
  const identifier = getIdentifier(engine)

  setValues({
    displayName: engineInfo.name,
    identifier,
  })
})

watchImmediate([() => values.fileAccessor], ([fileAccessor]) => {
  if (fileAccessor.isDummy) {
    return
  }

  setValues({
    displayName: fileAccessor.getName(),
  })
})

watchImmediate([() => values.connectionString], ([connectionString]) => {
  if (values.driver === DataSourceDriver.SQLite) {
    const [_, fileName] = connectionString.match(/[/\\]([^/\\]+)$/) ?? []

    return setValues({
      displayName: fileName,
    })
  }

  if (
    values.driver === DataSourceDriver.PostgreSQL ||
    values.driver === DataSourceDriver.MySQL
  ) {
    const match = connectionString.match(
      /(.*:\/\/)?((?<user>.*):(?<password>.*)@)?(?<host>.*):(?<port>[^\/]*)(\/(?<database>.*))?/,
    )

    if (!match) {
      return
    }

    const { host, database } = match.groups ?? {}

    if (!host && !database) {
      return
    }

    return setValues({
      displayName: [database, host].filter((x) => x).join('@'),
    })
  }
})

const supportsIdentifier = useDriverSupports(
  () => values.driver,
  DataSourceDriverCapability.Identifier,
)

const supportsConnectionString = useDriverSupports(
  () => values.driver,
  DataSourceDriverCapability.ConnectionString,
)

const supportsImportDump = useDriverSupports(
  () => values.driver,
  DataSourceDriverCapability.ImportDump,
)

const isExperimental = useDriverSupports(
  () => values.driver,
  DataSourceDriverCapability.Experimental,
)

const requiresDesktop = useDriverSupports(
  () => values.driver,
  DataSourceDriverCapability.RequiresDesktopApp,
)

const showRequiresDesktop = computed(() => {
  return requiresDesktop.value && !isTauri
})

const onSubmit = handleSubmit(async (values) => {
  create(values)
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
      <ResponsiveDialogBody class="flex flex-col gap-4">
        <LargeDatabaseEngineSelectField
          name="engine"
          :show="step === Step.Engine"
        />
        <LargeDataSourceModeSelectField
          name="mode"
          :engine="values.engine"
          :show="step === Step.Mode"
        />
        <template v-if="step === Step.Details">
          <BaseField
            name="displayName"
            label="Display Name"
            helper-text="Give your database a nice name."
          >
            <InputField name="displayName" />
          </BaseField>
          <Separator />
          <BaseField
            v-if="supportsIdentifier"
            name="identifier"
            label="Identifier"
            helper-text="The identifier is used to uniquely identify the database."
          >
            <InputField name="identifier" />
          </BaseField>
          <BaseField
            v-if="values.mode === DataSourceMode.AttachFile"
            name="connectionString"
            label="File Path"
            helper-text="The absolute path to the file that should be attached."
          >
            <FileSelectField name="connectionString" />
          </BaseField>
          <BaseField
            v-else-if="
              values.mode !== DataSourceMode.Memory && supportsConnectionString
            "
            name="connectionString"
            label="URL"
            helper-text="The connection string used to connect to the database."
          >
            <InputField
              name="connectionString"
              :placeholder="
                (values.driver === DataSourceDriver.PostgreSQL &&
                  'postgresql://user:password@host:port/database') ||
                (values.driver === DataSourceDriver.MySQL &&
                  'mysql://user:password@host:port/database') ||
                ''
              "
            />
          </BaseField>
          <BaseField
            v-if="supportsImportDump"
            name="fileAccessor"
            label="Import File"
            :helper-text="
              (values.driver === DataSourceDriver.SQLiteWASM &&
                'You can open any SQLite file like .db, .sqlite, or .sqlite3.') ||
              (values.driver === DataSourceDriver.PGLite &&
                'Upload a .tar.gz file containing a PostgreSQL data directory. This feature is only designed to import dumps created by PGLite.') ||
              'Upload a file containing a database dump.'
            "
          >
            <FileInputField name="fileAccessor" />
          </BaseField>
        </template>
        <Alert v-if="supportsImportDump">
          <InfoIcon class="size-4" />
          <AlertDescription>
            This configuration allows you to import a database dump. Note that
            no data entered here will be stored to the original file.
          </AlertDescription>
        </Alert>
        <Alert v-if="values.mode === DataSourceMode.Memory">
          <InfoIcon class="size-4" />
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>
            <template v-if="isBrowser">
              Data written to In-memory databases will be lost when you close
              this tab or refresh the page.
            </template>
            <template v-else>
              Data written to In-memory databases will be lost when the
              application is closed.
            </template>
          </AlertDescription>
        </Alert>
        <Alert
          v-if="values.mode === DataSourceMode.BrowserPersisted && isBrowser"
        >
          <InfoIcon class="size-4" />
          <AlertDescription>
            This database lives in your browser. Data written to it will be
            stored in your browser's local storage. No data is ever sent to our
            servers.
          </AlertDescription>
        </Alert>
        <Alert v-if="values.mode === DataSourceMode.Memory && isBrowser">
          <InfoIcon class="size-4" />
          <AlertDescription>
            This database lives in your browser. No data is ever sent to our
            servers.
          </AlertDescription>
        </Alert>
        <Alert v-if="isExperimental">
          <FlaskConicalIcon class="size-4" />
          <AlertTitle>Experimental Feature</AlertTitle>
          <AlertDescription>
            Support for this database is still in it's early stages. Expect bugs
            and missing features.
          </AlertDescription>
        </Alert>
        <Alert v-if="showRequiresDesktop">
          <AppWindowIcon class="size-4" />
          <AlertTitle>Ready for more?</AlertTitle>
          <AlertDescription>
            This driver only works using the desktop app of SqlZen.
          </AlertDescription>
        </Alert>
      </ResponsiveDialogBody>
      <ResponsiveDialogFooter v-if="step === Step.Details">
        <Button @click="close" variant="ghost">Cancel</Button>
        <Button
          v-if="showRequiresDesktop"
          as-child
          @click="close"
          class="gap-3"
        >
          <RouterLink to="/download">
            <DownloadIcon class="size-4" />
            <span>Download the App</span>
          </RouterLink>
        </Button>
        <Button v-else @click="onSubmit">Create</Button>
      </ResponsiveDialogFooter>
    </ResponsiveDialogContent>
  </ResponsiveDialog>
</template>
