<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { getEngineInfo } from '@/lib/engines/helpers'
import { computed } from 'vue'
import { useRegistry } from '@/composables/useRegistry'
import { SquareTerminalIcon, Trash2Icon } from 'lucide-vue-next'
import SchemaTree from '@/components/editor/SchemaTree.vue'
import { useDataSourceStatus } from '@/composables/useDataSourceStatus'
import { DataSourceStatus } from '@/lib/registry/enums'

const props = defineProps<{
  dataSourceKey: string
  isActive: boolean
}>()

const emit = defineEmits<{
  select: []
  delete: []
}>()

const registry = useRegistry()
const descriptor = computed(() => registry.getDescriptor(props.dataSourceKey))
const engineInfo = computed(() => getEngineInfo(descriptor.value.engine))
const status = useDataSourceStatus(props.dataSourceKey)

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
        class="-ml-3 gap-3 items-center"
      >
        <span class="relative min-w-max">
          <img
            :src="engineInfo.icon"
            :alt="`${engineInfo.name} icon`"
            class="size-4 min-w-max text-muted-foreground"
          />
          <span
            :data-state="status"
            class="block absolute -top-1 -right-1 size-1.5 rounded-full data-[state=running]:bg-green-500 data-[state=pending]:bg-orange-500 data-[state=stopped]:bg-red-500"
          />
        </span>
        <span class="font-medium">{{
          !descriptor.identifier
            ? `${engineInfo.name}`
            : `${descriptor.identifier}`
        }}</span>
      </Button>
      <div class="flex items-center">
        <SquareTerminalIcon
          v-if="isActive"
          class="size-4 min-w-max text-muted-foreground mx-2"
        />
        <Button v-else @click="handleDelete" size="xs" variant="ghost">
          <Trash2Icon class="size-4 min-w-max" />
        </Button>
      </div>
    </div>
    <SchemaTree
      v-if="isActive && status === DataSourceStatus.Running"
      :data-source-key="dataSourceKey"
      class="ml-1"
    />
  </article>
</template>
