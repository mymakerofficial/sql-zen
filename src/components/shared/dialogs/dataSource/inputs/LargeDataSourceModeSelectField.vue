<script setup lang="ts">
import LargeSelect from '@/components/shared/dialogs/dataSource/inputs/LargeSelect.vue'
import { type Component, computed } from 'vue'
import { useField } from 'vee-validate'
import { DataSourceMode } from '@/lib/dataSources/enums'
import { getDataSourceModeInfo } from '@/lib/dataSources/helpers'
import {
  type DataSourceModeInfo,
  dataSourceModes,
} from '@/lib/dataSources/constants'

const props = withDefaults(
  defineProps<{
    name: string
    show?: boolean
  }>(),
  {
    show: true,
  },
)

const { value } = useField<DataSourceMode>(props.name)

const translatedValue = computed<DataSourceModeInfo | undefined>({
  get: () => {
    return getDataSourceModeInfo(value.value)
  },
  set: (newValue) => {
    value.value = newValue?.mode ?? DataSourceMode.None
  },
})

function filterFunction(items: DataSourceModeInfo[], term: string) {
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
    v-if="show"
    v-model="translatedValue"
    :items="dataSourceModes"
    :filter-function="filterFunction"
    :key="name"
    placeholder="How do you want to connect?"
  >
    <template #icon="{ item }">
      <component :is="item.icon" class="size-6" />
    </template>
    <template #title="{ item }">{{ item.name }}</template>
    <template #description="{ item }">{{ item.description }}</template>
  </LargeSelect>
</template>
