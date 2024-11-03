<script setup lang="ts">
import LargeSelect from '@/components/shared/dialogs/dataSource/inputs/LargeSelect.vue'
import { type Component, ref } from 'vue'
import { CableIcon, CpuIcon, HardDriveIcon } from 'lucide-vue-next'

type Info = {
  icon: Component
  name: string
  description: string
}

const value = ref<Info | undefined>()

const values: Info[] = [
  {
    icon: CableIcon,
    name: 'Connection',
    description: 'Connect to a local or remote database.',
  },
  {
    icon: CpuIcon,
    name: 'In-memory',
    description:
      'Data is kept in memory and will be lost when the application is closed or reloaded.',
  },
  {
    icon: HardDriveIcon,
    name: 'Persisted',
    description:
      "Data will be saved in your browser. Data will be lost if you clear your browser's data.",
  },
]

function filterFunction(items: Info[], term: string) {
  return items.filter((item) => {
    return (
      item.name.toLowerCase().includes(term.toLowerCase()) ||
      item.description.toLowerCase().includes(term.toLowerCase())
    )
  })
}
</script>

<template>
  <LargeSelect
    v-model="value"
    :items="values"
    :filter-function="filterFunction"
    placeholder="How do you want to connect?"
  >
    <template #icon="{ item }">
      <component :is="item.icon" class="size-6" />
    </template>
    <template #title="{ item }">{{ item.name }}</template>
    <template #description="{ item }">{{ item.description }}</template>
  </LargeSelect>
</template>
