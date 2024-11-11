<script setup lang="ts">
import LargeSelect from '@/components/shared/dialogs/dataSource/inputs/LargeSelect.vue'
import { computed } from 'vue'
import { useField } from 'vee-validate'
import { DataSourceMode } from '@/lib/dataSources/enums'
import { getDataSourceModeInfo } from '@/lib/dataSources/helpers'
import { type DataSourceModeInfo } from '@/lib/dataSources/constants'
import type { DatabaseEngine } from '@/lib/engines/enums'
import {
  getAvailableModesForEngine,
  getEngineAndModeRequiresDesktop,
  getEngineRequiresDesktop,
  sortModesByAvailability,
} from '@/lib/engines/helpers'
import { useEnv } from '@/composables/useEnv'
import { AppWindowIcon } from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    name: string
    engine: DatabaseEngine
    show?: boolean
  }>(),
  {
    show: true,
  },
)

const { isBrowser } = useEnv()

const modes = computed(() => {
  const modes = getAvailableModesForEngine(props.engine)
  return sortModesByAvailability(props.engine, modes).map((mode) => {
    return getDataSourceModeInfo(mode)
  })
})

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
    v-show="show"
    v-model="translatedValue"
    :items="modes"
    :filter-function="filterFunction"
    :key="name"
    placeholder="How do you want to connect?"
  >
    <template #icon="{ item }">
      <component :is="item.icon" class="size-6" />
    </template>
    <template #title="{ item }">
      <span>{{ item.name }}</span>
      <span
        v-if="isBrowser && getEngineAndModeRequiresDesktop(engine, item.mode)"
        class="flex items-center gap-1 text-xs text-muted-foreground"
      >
        <AppWindowIcon class="size-3.5" />
        <span>Desktop App Required</span>
      </span>
    </template>
    <template #description="{ item }">{{ item.description }}</template>
  </LargeSelect>
</template>
