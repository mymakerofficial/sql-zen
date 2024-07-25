<script setup lang="ts">
import { Primitive, useId } from 'radix-vue'
import { ref } from 'vue'
import { FileAccessor } from '@/lib/files/fileAccessor'

const emit = defineEmits<{
  selected: [FileAccessor]
}>()

// @ts-ignore
const supportsOpenFilePicker = window.showOpenFilePicker !== undefined

const inputId = useId()
const input = ref<HTMLInputElement | null>(null)

function handleSelectedFile(fileAccessor: FileAccessor) {
  emit('selected', fileAccessor)
}

function openFileInput() {
  input.value?.click()
}

function handleInputChange(event: Event) {
  const files = (event.target as HTMLInputElement).files
  if (!files) {
    return
  }
  const file = files[0]
  const fileAccessor = FileAccessor.fromFile(file)
  handleSelectedFile(fileAccessor)
}

function openFilePicker() {
  // @ts-ignore
  window.showOpenFilePicker().then(([fileHandle]) => {
    const fileAccessor = FileAccessor.fromFileSystemFileHandle(fileHandle)
    handleSelectedFile(fileAccessor)
  })
}

function handleClick() {
  if (supportsOpenFilePicker) {
    console.debug('Using open file picker')
    openFilePicker()
  } else {
    console.debug('Using input file picker')
    openFileInput()
  }
}
</script>

<template>
  <Primitive @click="handleClick" as-child>
    <slot />
  </Primitive>
  <Teleport to="body">
    <input @change="handleInputChange" ref="input" type="file" :id="inputId" class="hidden" />
  </Teleport>
</template>
