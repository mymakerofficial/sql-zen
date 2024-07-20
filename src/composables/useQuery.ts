import { useMutation } from '@tanstack/vue-query'
import { computed } from 'vue'
import type { DatabaseFacade, QueryResult } from '@/lib/database'

export function useQuery(database: DatabaseFacade) {
  const {
    mutate: query,
    data,
    ...rest
  } = useMutation({
    mutationFn: database.query,
  })

  return {
    query,
    data: computed(() => (data.value ?? []) as QueryResult),
    ...rest,
  }
}
