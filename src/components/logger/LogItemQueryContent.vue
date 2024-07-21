<script setup lang="ts">
import { PromiseState, type QueryLogEvent } from '@/lib/logger/logger'
import CodeBlock from '@/components/shared/CodeBlock.vue'
import ResultTable from '@/components/shared/table/ResultTable.vue'
import { ChevronRightIcon } from 'lucide-vue-next'

defineProps<{
  event: QueryLogEvent
}>()
</script>

<template>
  <div class="flex gap-2">
    <ChevronRightIcon class="size-5 text-muted-foreground" />
    <div class="flex flex-col gap-2">
      <CodeBlock
        :code="event.sql"
        class="flex-1 [&_pre]:!bg-transparent text-sm"
      />
      <template v-if="event.state === PromiseState.Success">
        <ResultTable
          v-if="event.result.length"
          :data="event.result"
          class="w-fit border border-border"
        />
      </template>
      <template v-else-if="event.state === PromiseState.Pending">
        <p class="text-muted-foreground text-sm">Executing...</p>
      </template>
      <template v-else-if="event.state === PromiseState.Error">
        <p class="text-red-500 text-sm">{{ event.error }}</p>
      </template>
    </div>
  </div>
</template>
