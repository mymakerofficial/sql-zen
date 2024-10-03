<script setup lang="ts">
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SelectTrigger as RadixSelectTrigger } from 'radix-vue'
import { computed, type HTMLAttributes, watch } from 'vue'
import { type DatabaseEngine, DataSourceDriver } from '@/lib/engines/enums'
import {
  getDataSourceDriversForEngine,
  getEngineInfo,
} from '@/lib/engines/helpers'
import DataSourceDriverSelectItemContent from '@/components/shared/dataSourceDriverSelect/DataSourceDriverSelectItemContent.vue'

const model = defineModel<DataSourceDriver>({
  default: DataSourceDriver.None,
})

const emit = defineEmits<{
  select: [DataSourceDriver]
}>()

const props = defineProps<{
  engine: DatabaseEngine
  class?: HTMLAttributes['class']
}>()

function handleSelect(value: string) {
  emit('select', value as DataSourceDriver)
}

const options = computed(() => getDataSourceDriversForEngine(props.engine))

watch(
  () => props.engine,
  () => {
    model.value = getEngineInfo(props.engine).defaultDriver
  },
  {
    immediate: model.value === DataSourceDriver.None,
  },
)
</script>

<template>
  <Select v-model="model" @update:model-value="handleSelect">
    <RadixSelectTrigger v-if="$slots.default" as-child>
      <slot />
    </RadixSelectTrigger>
    <SelectTrigger v-else :class="props.class">
      <SelectValue
        placeholder="Select driver..."
        class="pr-3 [&_[data-description]]:hidden"
      />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectItem
          v-for="item in options"
          :value="item.driver"
          :key="item.driver"
          class="px-3"
        >
          <DataSourceDriverSelectItemContent v-bind="item" />
        </SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
</template>
