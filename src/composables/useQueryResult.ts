import type { IQuery } from '@/lib/queries/interface'
import { keepPreviousData, useQuery } from '@tanstack/vue-query'
import { useQueryHasResult } from '@/composables/useQueryHasResult'
import type { MaybeRefOrGetter } from 'vue'
import { toValue } from '@vueuse/core'

export type UseQueryResultOptions = {
  offset?: MaybeRefOrGetter<number>
  limit?: MaybeRefOrGetter<number>
}

export function useQueryResult(
  query: IQuery,
  options: UseQueryResultOptions = {},
) {
  const { offset = 0, limit = 100 } = options

  const hasResult = useQueryHasResult(query)

  return useQuery({
    queryKey: ['query', query.getId(), 'result', { offset, limit }],
    queryFn: async () => {
      await query.fetchRows(toValue(offset), toValue(limit))
      return query.getResult()
    },
    placeholderData: keepPreviousData,
    refetchOnMount: false,
    enabled: hasResult,
    staleTime: Infinity,
  })
}
