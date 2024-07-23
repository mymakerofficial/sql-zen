<script setup lang="ts">
import BaseDialog from '@/components/shared/dialog/BaseDialog.vue'
import { useDialogContext } from '@/composables/useDialog'

const { open } = useDialogContext()
</script>

<template>
  <BaseDialog
    v-model:open="open"
    title="This is a Dialog."
    description="Look at how dialog this dialog is."
  >
  </BaseDialog>
</template>
