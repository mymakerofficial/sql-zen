<script setup lang="ts">
import { type LogEvent, LogEventType, QueryState } from '@/lib/logger/logger'
import { ChevronRightIcon } from 'lucide-vue-next'
import ResultTable from '@/components/shared/table/ResultTable.vue'
import CodeBlock from '@/components/shared/CodeBlock.vue'

defineProps<{
  event: LogEvent
}>()
</script>

<template>
  <template v-if="event.type === LogEventType.Query">
    <div class="px-2 py-4 border-b border-border">
      <div class="flex gap-2">
        <ChevronRightIcon class="size-5 text-muted-foreground" />
        <div class="flex flex-col gap-2">
          <CodeBlock
            :code="event.sql"
            class="flex-1 [&_pre]:!bg-transparent text-sm"
          />
          <template v-if="event.state === QueryState.Success">
            <ResultTable
              v-if="event.result.length"
              :data="event.result"
              class="w-fit border border-border"
            />
          </template>
          <template v-else-if="event.state === QueryState.Pending">
            <p class="text-muted-foreground">Executing...</p>
          </template>
          <template v-else-if="event.state === QueryState.Error">
            <p class="text-red-500">{{ event.error }}</p>
          </template>
        </div>
      </div>
    </div>
  </template>
  <template v-else>
    <div class="px-2 py-4 border-b border-border">
      <p class="text-muted-foreground">Unsupported log message</p>
    </div>
  </template>
</template>
