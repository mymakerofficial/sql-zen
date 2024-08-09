<script setup lang="ts">
import { getDataSourceDisplayName } from '@/lib/dataSources/helpers'
import { useDataSourceDescriptor } from '@/composables/useDataSourceDescriptor'
import { computed } from 'vue'
import { getEngineInfo } from '@/lib/engines/helpers'
import { Button } from '@/components/ui/button'

const props = defineProps<{
  dataSourceKey: string
}>()

const emit = defineEmits<{
  select: []
}>()

const descriptor = useDataSourceDescriptor(props.dataSourceKey)
const engineInfo = computed(() => getEngineInfo(descriptor.value!.engine))

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
      class="size-4 min-w-max text-muted-foreground"
    />
    <span class="font-medium">{{ getDataSourceDisplayName(descriptor!) }}</span>
  </Button>
</template>
