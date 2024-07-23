<script setup lang="ts">
import { useDialogState } from '@/composables/useDialog'
import DialogContextProvider from '@/components/shared/dialog/DialogContextProvider.vue'

const { dialogs } = useDialogState()
</script>

<template>
  <template v-for="[id, node] in dialogs" :key="id">
    <DialogContextProvider :id="id">
      <Component :is="node" />
    </DialogContextProvider>
  </template>
</template>
