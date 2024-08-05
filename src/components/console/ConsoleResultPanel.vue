<script setup lang="ts">
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { computed, ref, watch } from 'vue'
import { SquareTerminalIcon, TableIcon } from 'lucide-vue-next'
import LoggerPanel from '@/components/logger/LoggerPanel.vue'
import { useRunnerQueries } from '@/composables/useRunnerQueries'
import type { IRunner } from '@/lib/runner/interface'
import QueryDisplay from '@/components/shared/query/QueryDisplay.vue'

const props = withDefaults(
  defineProps<{
    runner: IRunner
    showResults?: boolean
  }>(),
  {
    showResults: true,
  },
)

const queries = useRunnerQueries(props.runner)

const triggers = computed(() => {
  return queries.value.map((id, index) => ({
    value: id,
    label: `Result ${index + 1}`,
  }))
})

const contents = computed(() => {
  return queries.value.map((id) => ({
    value: id,
    data: props.runner.getQuery(id),
  }))
})

const selected = ref('log')

watch(
  queries,
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
        <SquareTerminalIcon class="size-4 min-w-max" />
        <span>Output</span>
      </TabsTrigger>
      <TabsTrigger
        v-for="trigger in triggers"
        :value="trigger.value"
        :key="trigger.value"
        class="gap-2"
      >
        <TableIcon class="size-4 min-w-max" />
        <span>{{ trigger.label }}</span>
      </TabsTrigger>
    </TabsList>
    <TabsContent value="log" class="flex-1 overflow-y-auto">
      <LoggerPanel :logger="props.runner.getDataSource().getLogger()" />
    </TabsContent>
    <TabsContent
      v-for="content in contents"
      :value="content.value"
      :key="content.value"
      class="flex-1 overflow-y-auto"
    >
      <QueryDisplay :query="content.data" />
    </TabsContent>
  </Tabs>
</template>
