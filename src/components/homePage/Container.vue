<script setup lang="ts">
import { Primitive, type PrimitiveProps } from 'radix-vue'

const props = defineProps<PrimitiveProps>()
</script>

<template>
  <Primitive class="md:px-16 lg:px-28 mx-auto max-w-[2024px]" v-bind="props">
    <slot />
  </Primitive>
</template>
