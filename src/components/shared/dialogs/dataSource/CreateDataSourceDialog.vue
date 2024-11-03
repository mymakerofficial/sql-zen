<script setup lang="ts">
import ResponsiveDialogContent from '@/components/shared/responsiveDialog/ResponsiveDialogContent.vue'
import ResponsiveDialogHeader from '@/components/shared/responsiveDialog/ResponsiveDialogHeader.vue'
import ResponsiveDialogTitle from '@/components/shared/responsiveDialog/ResponsiveDialogTitle.vue'
import ResponsiveDialogDescription from '@/components/shared/responsiveDialog/ResponsiveDialogDescription.vue'
import ResponsiveDialog from '@/components/shared/responsiveDialog/ResponsiveDialog.vue'
import { useDialogContext } from '@/composables/useDialog'
import ResponsiveDialogBody from '@/components/shared/responsiveDialog/ResponsiveDialogBody.vue'
import { ref } from 'vue'
import LargeDatabaseEngineSelect from '@/components/shared/dialogs/dataSource/inputs/LargeDatabaseEngineSelect.vue'
import { DatabaseEngine } from '@/lib/engines/enums'
import LargeDataSourceModeSelect from '@/components/shared/dialogs/dataSource/inputs/LargeDataSourceModeSelect.vue'

const { open } = useDialogContext()

const engine = ref(DatabaseEngine.None)
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
        <LargeDatabaseEngineSelect
          v-if="engine === DatabaseEngine.None"
          v-model="engine"
        />
        <LargeDataSourceModeSelect v-else v-model="engine" />
      </ResponsiveDialogBody>
    </ResponsiveDialogContent>
  </ResponsiveDialog>
</template>
