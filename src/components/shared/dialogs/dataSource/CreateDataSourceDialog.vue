<script setup lang="ts">
import ResponsiveDialogContent from '@/components/shared/responsiveDialog/ResponsiveDialogContent.vue'
import ResponsiveDialogHeader from '@/components/shared/responsiveDialog/ResponsiveDialogHeader.vue'
import ResponsiveDialogTitle from '@/components/shared/responsiveDialog/ResponsiveDialogTitle.vue'
import ResponsiveDialogDescription from '@/components/shared/responsiveDialog/ResponsiveDialogDescription.vue'
import ResponsiveDialog from '@/components/shared/responsiveDialog/ResponsiveDialog.vue'
import { useDialogContext } from '@/composables/useDialog'
import ResponsiveDialogBody from '@/components/shared/responsiveDialog/ResponsiveDialogBody.vue'
import { DatabaseEngine } from '@/lib/engines/enums'
import { useForm } from 'vee-validate'
import * as z from 'zod'
import { DataSourceMode } from '@/lib/dataSources/enums'
import { toTypedSchema } from '@vee-validate/zod'
import LargeDatabaseEngineSelectField from '@/components/shared/dialogs/dataSource/inputs/LargeDatabaseEngineSelectField.vue'
import LargeDataSourceModeSelectField from '@/components/shared/dialogs/dataSource/inputs/LargeDataSourceModeSelectField.vue'
import { computed } from 'vue'
import ResponsiveDialogFooter from '@/components/shared/responsiveDialog/ResponsiveDialogFooter.vue'
import { Button } from '@/components/ui/button'
import InputField from '@/components/shared/dialogs/dataSource/inputs/InputField.vue'
import { getDriverForEngineAndMode } from '@/lib/engines/helpers'

const Step = {
  Engine: 1,
  Mode: 2,
  Details: 3,
} as const
type Step = (typeof Step)[keyof typeof Step]

const { open, close } = useDialogContext()

const schema = z.object({
  engine: z.nativeEnum(DatabaseEngine),
  mode: z.nativeEnum(DataSourceMode),
  displayName: z.string().min(1).max(64),
})

const { values, handleSubmit } = useForm<z.infer<typeof schema>>({
  validationSchema: toTypedSchema(schema),
  initialValues: {
    engine: DatabaseEngine.None,
    mode: DataSourceMode.None,
    displayName: '',
  },
})

const step = computed<Step>(() => {
  if (values.engine === DatabaseEngine.None) {
    return Step.Engine
  }

  if (values.mode === DataSourceMode.None) {
    return Step.Mode
  }

  return Step.Details
})

const onSubmit = handleSubmit(async (values) => {
  console.log(values)
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
      <ResponsiveDialogBody class="flex flex-col gap-2">
        <pre>{{ values }}</pre>
        <pre>{{ getDriverForEngineAndMode(values.engine, values.mode) }}</pre>
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
          <InputField name="displayName" />
        </template>
      </ResponsiveDialogBody>
      <ResponsiveDialogFooter v-if="step === Step.Details">
        <Button @click="close" variant="ghost">Cancel</Button>
        <Button @click="onSubmit">Create</Button>
      </ResponsiveDialogFooter>
    </ResponsiveDialogContent>
  </ResponsiveDialog>
</template>
