<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { FileIcon } from 'lucide-vue-next'
import { useField } from 'vee-validate'
import { open as openFileSelector } from '@tauri-apps/plugin-dialog'
import InputField from '@/components/shared/dialogs/dataSource/inputs/InputField.vue'

const props = defineProps<{
  name: string
}>()

const { value, setValue } = useField(props.name)

async function handleClick() {
  const file = await openFileSelector({
    title: 'Select File',
    multiple: false,
    directory: false,
  })

  setValue(file)
}
</script>

<template>
  <div class="flex gap-3">
    <InputField :name="name" />
    <Button @click="handleClick" variant="outline" class="w-10">
      <FileIcon class="size-4 min-w-max" />
    </Button>
  </div>
</template>
