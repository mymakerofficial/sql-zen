<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { getEngineInfo } from '@/lib/engines/helpers'
import { computed } from 'vue'
import { Trash2Icon, FlaskConicalIcon } from 'lucide-vue-next'
import DSTree from '@/components/databaseExplorer/DSTree.vue'
import { useDataSourceInfo } from '@/composables/dataSources/useDataSourceInfo'
import { DataSourceStatus } from '@/lib/dataSources/enums'
import { useDriverSupports } from '@/composables/engines/useDriverSupports'
import { DataSourceDriverCapability } from '@/lib/engines/enums'

const props = defineProps<{
  dataSourceKey: string
  hideActions?: boolean
}>()

const emit = defineEmits<{
  select: []
  delete: []
}>()

const info = useDataSourceInfo(props.dataSourceKey)
const engineInfo = computed(() => getEngineInfo(info.value.engine))

const isExperimental = useDriverSupports(
  () => info.value.driver,
  DataSourceDriverCapability.Experimental,
)

function handleSelect() {
  emit('select')
}

function handleDelete() {
  emit('delete')
}
</script>

<template>
  <article class="flex flex-col">
    <div class="flex items-center justify-between">
      <Button
        @click="handleSelect"
        size="sm"
        variant="ghost"
        class="flex-grow gap-3 items-center justify-start"
      >
        <span class="relative min-w-max">
          <img
            :src="engineInfo.icon"
            :alt="`${engineInfo.name} icon`"
            class="size-4 text-muted-foreground"
          />
          <span
            :data-status="info.status"
            class="block absolute -top-1 -right-1 size-1.5 rounded-full data-[status=running]:bg-green-500 data-[status=pending]:bg-orange-500 data-[status=stopped]:bg-red-500"
          />
        </span>
        <span class="font-medium truncate">{{ info.displayName }}</span>
      </Button>
      <div v-if="!hideActions" class="flex items-center">
        <Button @click="handleDelete" size="xs" variant="ghost">
          <Trash2Icon class="size-4" />
        </Button>
      </div>
    </div>
    <div v-if="isExperimental" class="mx-3 my-2 space-y-1">
      <span
        class="flex items-center gap-3 text-sm font-medium text-amber-400"
      >
        <FlaskConicalIcon class="size-4 min-size-4" />
        <span>Experimental</span>
      </span>
      <p class="ml-7 text-xs text-amber-500/80">
        Support for {{ engineInfo.name }} is still in it's early stages. Expect
        bugs and missing features.
      </p>
    </div>
    <DSTree
      v-if="info.status === DataSourceStatus.Running"
      :data-source-key="dataSourceKey"
    />
  </article>
</template>
