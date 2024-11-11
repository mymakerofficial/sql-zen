<script setup lang="ts">
import DataSourceDriverSelect from '@/components/shared/dataSourceDriverSelect/DataSourceDriverSelect.vue'
import type { DatabaseEngine, DataSourceDriver } from '@/lib/engines/enums'
import { useField } from 'vee-validate'
import type { DataSourceMode } from '@/lib/dataSources/enums'

const props = defineProps<{
  name: string
  engine: DatabaseEngine
  mode: DataSourceMode
}>()

const { value, setValue } = useField<DataSourceDriver>(props.name)
</script>

<template>
  <DataSourceDriverSelect
    :model-value="value"
    @select="setValue"
    :engine="engine"
    :mode="mode"
  />
</template>
