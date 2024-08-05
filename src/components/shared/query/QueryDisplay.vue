<script setup lang="ts">
import type { IQuery } from '@/lib/queries/interface'
import ResultTable from '@/components/shared/table/ResultTable.vue'
import { useQueryResult } from '@/composables/useQueryResult'
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-vue-next'
import { isPaginatedQueryResult } from '@/lib/queries/helpers'

const props = defineProps<{
  query: IQuery
}>()

const offset = ref(0)
const limit = ref(100)

const { data: result } = useQueryResult(props.query, {
  offset,
  limit,
})

function previousPage() {
  offset.value -= limit.value
}

function nextPage() {
  offset.value += limit.value
}
</script>

<template>
  <div class="flex-1">
    <div
      v-if="isPaginatedQueryResult(result)"
      class="p-1 border-b border-border flex gap-2 items-center"
    >
      <Button
        @click="previousPage"
        :disabled="offset === 0"
        variant="ghost"
        size="xs"
        aria-label="Previous page"
      >
        <ArrowLeftIcon class="size-4 min-w-max" />
      </Button>
      <span class="text-xs text-muted-foreground">
        {{ offset + 1 }} - {{ offset + limit }} of {{ result.totalRows }}
      </span>
      <Button
        @click="nextPage"
        :disabled="offset + limit >= result.totalRows"
        variant="ghost"
        size="xs"
        aria-label="Next page"
      >
        <ArrowRightIcon class="size-4 min-w-max" />
      </Button>
    </div>
    <ResultTable v-if="result" :data="result" />
  </div>
</template>
