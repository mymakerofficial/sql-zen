<script setup lang="ts">
import CodeBlock from '@/components/shared/CodeBlock.vue'
import { ChevronRightIcon } from 'lucide-vue-next'
import type { LogQueryEvent } from '@/lib/logger/interface'
import { PromiseState } from '@/lib/logger/enums'
import { computed } from 'vue'

const props = defineProps<{
  event: LogQueryEvent
}>()

const successLabel = computed(() => {
  if (props.event.data.state !== PromiseState.Success) {
    return ''
  }

  const duration = Math.round(props.event.data.duration * 100) / 100

  if (props.event.data.affectedRows) {
    return `${props.event.data.affectedRows} rows affected in ${duration} ms`
  }

  if (props.event.data.rowCount) {
    return `${props.event.data.rowCount} rows retrieved in ${duration} ms`
  }

  return `Completed in ${duration} ms`
})
</script>

<template>
  <div class="flex gap-2">
    <ChevronRightIcon class="size-5 min-h-max text-muted-foreground" />
    <div class="flex flex-col gap-2">
      <CodeBlock
        :code="event.data.sql"
        class="flex-1 [&_pre]:!bg-transparent text-sm"
      />
      <template v-if="event.data.state === PromiseState.Success">
        <i class="text-muted-foreground text-sm">
          {{ successLabel }}
        </i>
        <!--        <ResultTable-->
        <!--          v-if="event.data.result.length > 0 && event.data.result.length < 10"-->
        <!--          :data="event.data.result"-->
        <!--          class="w-fit border border-border"-->
        <!--        />-->
      </template>
      <template v-else-if="event.data.state === PromiseState.Pending">
        <p class="text-muted-foreground text-sm">Executing...</p>
      </template>
      <template v-else-if="event.data.state === PromiseState.Error">
        <p class="text-red-500 text-sm">Error: {{ event.data.errorMessage }}</p>
      </template>
    </div>
  </div>
</template>
