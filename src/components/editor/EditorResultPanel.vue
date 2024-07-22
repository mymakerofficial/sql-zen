<script setup lang="ts">
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { computed, ref, watch } from 'vue'
import ResultTable from '@/components/shared/table/ResultTable.vue'
import { SquareTerminalIcon, TableIcon } from 'lucide-vue-next'
import LoggerPanel from '@/components/logger/LoggerPanel.vue'
import { isSuccessful, type Runner } from '@/lib/runner/runner'
import { useRunnerQueries } from '@/composables/useRunnerQueries'

const props = defineProps<{
  runner: Runner
}>()

const queries = useRunnerQueries(props.runner)
const results = computed(() => {
  return queries.value.filter(isSuccessful).map((query) => query.result)
})
const nonEmptyResults = computed(() =>
  results.value.filter((result) => result.length > 0),
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
  nonEmptyResults,
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
      <LoggerPanel :logger="props.runner.getDatabase().getLogger()" />
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
