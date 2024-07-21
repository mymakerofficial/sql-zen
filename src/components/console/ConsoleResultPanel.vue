<script setup lang="ts">
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import type { QueryResult } from '@/lib/databases/database'
import { computed } from 'vue'
import ResultTable from '@/components/shared/table/ResultTable.vue'
import { TableIcon } from 'lucide-vue-next'

const props = defineProps<{
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
</script>

<template>
  <Tabs
    :default-value="triggers[triggers.length - 1]?.value"
    class="h-full flex flex-col"
  >
    <TabsList v-if="triggers.length > 1" class="w-full border-b">
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
