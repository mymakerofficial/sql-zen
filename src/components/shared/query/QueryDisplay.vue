<script setup lang="ts">
import ResultTable from '@/components/shared/table/ResultTable.vue'
import { useQueryResult } from '@/composables/useQueryResult'
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-vue-next'
import { isPaginatedQueryResult } from '@/lib/queries/helpers'
import { useQueryHasResult } from '@/composables/useQueryTotalRows'
import { useMutation } from '@tanstack/vue-query'
import LimitSelect from '@/components/shared/LimitSelect.vue'
import { useRegistry } from '@/composables/useRegistry'

const props = defineProps<{
  dataSourceId: string
  queryId: string
}>()

const registry = useRegistry()
const query = registry
  .getDataSource(props.dataSourceId)
  .runner.getQuery(props.queryId)

const offset = ref(0)
const limit = ref(100)

const totalRows = useQueryHasResult(query)
const { data: result } = useQueryResult(query, {
  offset,
  limit,
})

function previousPage() {
  offset.value = Math.max(offset.value - limit.value, 0)
}

function nextPage() {
  offset.value += limit.value
}

const { mutateAsync: computeTotalRowCount } = useMutation({
  mutationFn: () => query.computeTotalRowCount(),
})
</script>

<template>
  <div class="flex-1 h-full flex flex-col">
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
        <ArrowLeftIcon class="size-4" />
      </Button>
      <span class="text-xs text-muted-foreground">
        <LimitSelect v-model="limit">
          <Button variant="ghost" size="xs" class="font-normal text-xs">
            {{ offset + 1 }} - {{ offset + result.rows.length }}
          </Button>
        </LimitSelect>
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
        :disabled="offset + limit >= totalRows.min && totalRows.isKnown"
        variant="ghost"
        size="xs"
        aria-label="Next page"
      >
        <ArrowRightIcon class="size-4" />
      </Button>
      <span class="ml-auto mx-2 text-xs text-muted-foreground space-x-2">
        <span>{{ Math.round(query.getResult().duration * 100) / 100 }}ms</span>
        <span
          >({{ Math.round(query.getResult().systemDuration * 100) / 100 }}ms
          sys)</span
        >
      </span>
    </div>
    <ResultTable v-if="result" :data="result" />
  </div>
</template>
