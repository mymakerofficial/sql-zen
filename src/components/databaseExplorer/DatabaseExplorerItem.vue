<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { getEngineInfo } from '@/lib/engines/helpers'
import { computed } from 'vue'
import { Trash2Icon } from 'lucide-vue-next'
import DSTree from '@/components/databaseExplorer/DSTree.vue'
import { useDataSourceInfo } from '@/composables/dataSources/useDataSourceInfo'
import { DataSourceStatus } from '@/lib/dataSources/enums'

const props = defineProps<{
  dataSourceKey: string
}>()

const emit = defineEmits<{
  select: []
  delete: []
}>()

const info = useDataSourceInfo(props.dataSourceKey)
const engineInfo = computed(() => getEngineInfo(info.value.engine))

function handleSelect() {
  emit('select')
}

function handleDelete() {
  emit('delete')
}
</script>

<template>
  <article class="py-4 pl-6 pr-3 flex flex-col">
    <div class="flex items-center justify-between text-sm">
      <Button
        @click="handleSelect"
        size="sm"
        variant="ghost"
        class="-ml-3 gap-3 items-center flex-1 justify-start"
      >
        <span class="relative min-w-max">
          <img
            :src="engineInfo.icon"
            :alt="`${engineInfo.name} icon`"
            class="size-4 min-h-max text-muted-foreground"
          />
          <span
            :data-status="info.status"
            class="block absolute -top-1 -right-1 size-1.5 rounded-full data-[status=running]:bg-green-500 data-[status=pending]:bg-orange-500 data-[status=stopped]:bg-red-500"
          />
        </span>
        <span class="font-medium">{{ info.displayName }}</span>
      </Button>
      <div class="flex items-center">
        <Button @click="handleDelete" size="xs" variant="ghost">
          <Trash2Icon class="size-4 min-h-max" />
        </Button>
      </div>
    </div>
    <DSTree
      v-if="info.status === DataSourceStatus.Running"
      :data-source-key="dataSourceKey"
    />
  </article>
</template>
