<script setup lang="ts">
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { QueryResult } from '@/lib/databases/database'
import { computed, ref, watch } from 'vue'
import ResultTable from '@/components/shared/table/ResultTable.vue'
import { SquareTerminalIcon, TableIcon } from 'lucide-vue-next'
import type { Logger } from '@/lib/logger/logger'
import LoggerPanel from '@/components/logger/LoggerPanel.vue'

const props = defineProps<{
  logger: Logger
  data: Array<QueryResult>
}>()

const nonEmptyResults = computed(() =>
  props.data.filter((result) => result.length > 0),
)

const triggers = computed(() => {
  return nonEmptyResults.value.map((_, index) => ({
    value: index.toString(),
    label: `Result ${index + 1}`,
  }))
})

const contents = computed(() => {
  return nonEmptyResults.value.map((data, index) => ({
    value: index.toString(),
    data,
  }))
})

const selected = ref('log')

watch(
  () => props.data,
  () => {
    selected.value = triggers.value[triggers.value.length - 1]?.value ?? 'log'
  },
  { immediate: true },
)
</script>

<template>
  <Tabs v-model="selected" class="h-full flex flex-col">
    <TabsList class="w-full border-b">
      <TabsTrigger value="log" class="gap-2">
        <SquareTerminalIcon class="size-4" />
        <span>Output</span>
      </TabsTrigger>
      <TabsTrigger
        v-for="trigger in triggers"
        :value="trigger.value"
        :key="trigger.value"
        class="gap-2"
      >
        <TableIcon class="size-4" />
        <span>{{ trigger.label }}</span>
      </TabsTrigger>
    </TabsList>
    <TabsContent value="log" class="flex-1 overflow-y-auto">
      <LoggerPanel :logger="props.logger" />
    </TabsContent>
    <TabsContent
      v-for="content in contents"
      :value="content.value"
      :key="content.value"
      class="flex-1 overflow-y-auto"
    >
      <ResultTable :data="content.data" />
    </TabsContent>
  </Tabs>
</template>
