import { useMutation } from '@tanstack/vue-query'
import { computed } from 'vue'
import type { DatabaseFacade } from '@/lib/databases/database'

export function useExec(database: DatabaseFacade) {
  const {
    mutate: exec,
    data,
    ...rest
  } = useMutation({
    mutationFn: (sql: string) => database.exec(sql),
    onError(error) {
      console.error('Error executing query', error)
    },
  })

  return {
    exec,
    data: computed(() => data.value ?? []),
    ...rest,
  }
}
