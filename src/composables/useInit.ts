import type { DatabaseFacade } from '@/lib/database'
import { useMutation } from '@tanstack/vue-query'

export function useInit(database: DatabaseFacade) {
  const { mutate: init, isPending: isInitializing } = useMutation({
    mutationFn: database.init,
  })

  return {
    init,
    isInitializing,
  }
}
