<script setup lang="ts">
import type { FieldInfo } from '@/lib/schema/columns/column'
import { computed } from 'vue'

const props = defineProps<{
  field: FieldInfo
  value: any
}>()

const isNull = computed(() => props.value === null)
const isUndefined = computed(() => props.value === undefined)
const isEmpty = computed(() => props.value === '')
</script>

<template>
  <span v-if="isNull" class="text-muted-foreground italic">NULL</span>
  <span v-else-if="isUndefined" class="text-muted-foreground italic">UNDEFINED</span>
  <span v-else-if="isEmpty" class="text-muted-foreground italic">EMPTY</span>
  <span v-else>{{ value }}</span>
</template>