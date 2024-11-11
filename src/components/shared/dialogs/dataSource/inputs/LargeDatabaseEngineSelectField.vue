<script setup lang="ts">
import { selectableDatabaseEngines } from '@/lib/engines/constants'
import LargeSelect from '@/components/shared/dialogs/dataSource/inputs/LargeSelect.vue'
import type { DatabaseEngineInfo } from '@/lib/engines/interface'
import { DatabaseEngine } from '@/lib/engines/enums'
import {
  getEngineInfo,
  getEngineRequiresDesktop,
  sortEnginesByAvailability,
} from '@/lib/engines/helpers'
import { computed } from 'vue'
import { useField } from 'vee-validate'
import { useEnv } from '@/composables/useEnv'
import { AppWindowIcon } from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    name: string
    show?: boolean
  }>(),
  {
    show: true,
  },
)

const { isBrowser } = useEnv()

const engines = computed(() => {
  const engines = selectableDatabaseEngines.map(({ engine }) => engine)
  return sortEnginesByAvailability(engines).map((engine) => {
    return getEngineInfo(engine)
  })
})

const { value } = useField<DatabaseEngine>(props.name)

const translatedValue = computed<DatabaseEngineInfo | undefined>({
  get: () => {
    return getEngineInfo(value.value)
  },
  set: (newValue) => {
    value.value = newValue?.engine ?? DatabaseEngine.None
  },
})

function filterFunction(items: DatabaseEngineInfo[], term: string) {
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
    :items="engines"
    :filter-function="filterFunction"
    placeholder="Select DBMS"
  >
    <template #icon="{ item }">
      <img :src="item.icon" :alt="`${item.name} Logo`" class="size-6" />
    </template>
    <template #title="{ item }">
      <span>{{ item.name }}</span>
      <span
        v-if="isBrowser && getEngineRequiresDesktop(item.engine)"
        class="flex items-center gap-1 text-xs text-muted-foreground"
      >
        <AppWindowIcon class="size-3.5" />
        <span>Desktop App Required</span>
      </span>
    </template>
    <template #description="{ item }">{{ item.description }}</template>
  </LargeSelect>
</template>
