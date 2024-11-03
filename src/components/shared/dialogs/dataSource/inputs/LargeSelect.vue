<script
  setup
  lang="ts"
  generic="T extends string | number | boolean | Record<string, any>"
>
import { defineComponent, ref } from 'vue'
import { onKeyStroke } from '@vueuse/core'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { useId } from 'radix-vue'
import { djb2 } from '@/lib/hash'

defineComponent({
  inheritAttrs: false,
})

defineSlots<{
  icon: (props: { item: T }) => any
  title: (props: { item: T }) => any
  description: (props: { item: T }) => any
}>()

const props = defineProps<{
  items: T[]
  filterFunction?: (val: T[], term: string) => T[]
  placeholder?: string
}>()
// @ts-ignore the type is correct but TS is not happy
const filterFunction = props.filterFunction as any

const modelValue = defineModel<T | undefined>({
  default: undefined,
})

const selected = ref<T | undefined>()

const id = useId()

function focusInput() {
  document
    .querySelector<HTMLInputElement>(`#${id} [cmdk-input-wrapper] input`)
    ?.focus()
}

onKeyStroke(['ArrowUp', 'ArrowDown'], (e) => {
  e.preventDefault()
  focusInput()
})
</script>

<template>
  <div :id="id">
    <Command
      v-model="modelValue"
      v-model:selected-value="selected"
      :filter-function="filterFunction"
    >
      <CommandInput :placeholder="placeholder" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          <CommandItem
            v-for="item in items"
            :value="item"
            :key="djb2(String(item))"
            as-child
          >
            <button
              tabindex=""
              @focusin="selected = item"
              class="flex flex-row gap-4 px-4 py-6 cursor-pointer w-full"
            >
              <span class="block mb-auto mt-1 min-w-max">
                <slot name="icon" v-bind="{ item }" />
              </span>
              <span class="space-y-1 text-start">
                <span class="block font-medium">
                  <slot name="title" v-bind="{ item }" />
                </span>
                <span
                  class="block text-xs text-muted-foreground"
                  data-description
                >
                  <slot name="description" v-bind="{ item }" />
                </span>
              </span>
            </button>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  </div>
</template>
