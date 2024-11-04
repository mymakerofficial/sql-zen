<script setup lang="ts">
import { Label } from '@/components/ui/label'
import { useField } from 'vee-validate'

const props = defineProps<{
  name: string
  label: string
  helperText?: string
}>()

const { errorMessage } = useField(props.name)
</script>

<template>
  <div class="grid grid-cols-4 items-center gap-4">
    <Label :for="name" class="ml-1">{{ label }}</Label>
    <div class="block col-span-3">
      <slot />
    </div>
    <p
      v-if="errorMessage"
      class="col-span-3 col-start-2 text-xs font-medium text-red-500"
    >
      {{ errorMessage }}
    </p>
    <p
      v-if="helperText"
      class="col-span-3 col-start-2 text-xs text-muted-foreground"
    >
      {{ helperText }}
    </p>
  </div>
</template>
