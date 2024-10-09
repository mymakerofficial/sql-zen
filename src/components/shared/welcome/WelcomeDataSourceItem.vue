<script setup lang="ts">
import { computed } from 'vue'
import { getEngineInfo } from '@/lib/engines/helpers'
import { Button } from '@/components/ui/button'
import { useDataSourceInfo } from '@/composables/dataSources/useDataSourceInfo'

const props = defineProps<{
  dataSourceKey: string
}>()

const emit = defineEmits<{
  select: []
}>()

const dataSourceInfo = useDataSourceInfo(props.dataSourceKey)
const engineInfo = computed(() => getEngineInfo(dataSourceInfo.value.engine))

function handleSelect() {
  emit('select')
}
</script>

<template>
  <Button
    @click="handleSelect"
    size="sm"
    variant="ghost"
    class="gap-3 justify-start"
  >
    <img
      :src="engineInfo.icon"
      :alt="`${engineInfo.name} icon`"
      class="size-4 text-muted-foreground"
    />
    <span class="font-medium">{{ dataSourceInfo.displayName }}</span>
  </Button>
</template>
