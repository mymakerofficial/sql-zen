<script setup lang="ts">
import { PromiseState, type QueryLogEvent } from '@/lib/logger/logger'
import CodeBlock from '@/components/shared/CodeBlock.vue'
import ResultTable from '@/components/shared/table/ResultTable.vue'
import { ChevronRightIcon } from 'lucide-vue-next'
import { computed } from 'vue'

const props = defineProps<{
  event: QueryLogEvent
}>()

const duration = computed(() => {
  if (props.event.state === PromiseState.Pending) {
    return 0
  }

  return props.event.finishDate.getTime() - props.event.date.getTime()
})
</script>

<template>
  <div class="flex gap-2">
    <ChevronRightIcon class="size-5 min-w-max text-muted-foreground" />
    <div class="flex flex-col gap-2">
      <CodeBlock
        :code="event.sql"
        class="flex-1 [&_pre]:!bg-transparent text-sm"
      />
      <template v-if="event.state === PromiseState.Success">
        <i class="text-muted-foreground text-sm">
          Finished in {{ duration }} ms
        </i>
        <ResultTable
          v-if="event.result.length > 0"
          :data="event.result"
          class="w-fit border border-border"
        />
      </template>
      <template v-else-if="event.state === PromiseState.Pending">
        <p class="text-muted-foreground text-sm">Executing...</p>
      </template>
      <template v-else-if="event.state === PromiseState.Error">
        <p class="text-red-500 text-sm">{{ event.error.message }}</p>
      </template>
    </div>
  </div>
</template>
