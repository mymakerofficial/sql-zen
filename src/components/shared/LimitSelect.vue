<script setup lang="ts">
import { SelectTrigger as RadixSelectTrigger } from 'radix-vue'
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from '@/components/ui/select'
import { computed, type HTMLAttributes } from 'vue'

const model = defineModel<number>({ default: 100 })

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const stringModel = computed({
  get: () => {
    return model.value.toString()
  },
  set: (value: string) => {
    model.value = parseInt(value, 10)
  },
})
</script>

<template>
  <Select v-model="stringModel">
    <RadixSelectTrigger v-if="$slots.default" as-child>
      <slot />
    </RadixSelectTrigger>
    <SelectTrigger v-else :class="props.class">
      <SelectValue placeholder="Select database..." />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectItem
          v-for="item in [10, 50, 100, 200, 500, 1000]"
          :value="item.toString()"
          :key="item"
          class="px-3"
        >
          {{ item }}
        </SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
</template>
