<script setup lang="ts">
import { useProvedDialogContext } from '@/composables/useDialog'

const props = defineProps<{
  id: string
}>()

useProvedDialogContext(props.id)
</script>

<template>
  <slot />
</template>
