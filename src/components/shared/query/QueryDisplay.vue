<script setup lang="ts">
import type { IQuery } from '@/lib/queries/interface'
import ResultTable from '@/components/shared/table/ResultTable.vue'
import { useQueryResult } from '@/composables/useQueryResult'
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-vue-next'
import { isPaginatedQueryResult } from '@/lib/queries/helpers'
import { useQueryHasResult } from '@/composables/useQueryTotalRows'
import { useMutation } from '@tanstack/vue-query'

const props = defineProps<{
  query: IQuery
}>()

const offset = ref(0)
const limit = ref(100)

const totalRows = useQueryHasResult(props.query)
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

const { mutateAsync: computeTotalRowCount } = useMutation({
  mutationFn: () => props.query.computeTotalRowCount(),
})
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
        <Button variant="ghost" size="xs" class="font-normal text-xs">
          {{ offset + 1 }} - {{ offset + limit }}
        </Button>
        of
        <Button
          v-if="!totalRows.isKnown"
          @click="computeTotalRowCount"
          variant="ghost"
          size="xs"
          class="font-normal text-xs"
          :aria-label="`Current total rows: ${totalRows.min}+, click to compute the exact total rows`"
        >
          {{ `${totalRows.min}+` }}
        </Button>
        <span v-else class="px-2">
          {{ totalRows.min }}
        </span>
      </span>
      <Button
        @click="nextPage"
        :disabled="
          totalRows !== null &&
          offset + limit >= totalRows.min &&
          totalRows.isKnown
        "
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
