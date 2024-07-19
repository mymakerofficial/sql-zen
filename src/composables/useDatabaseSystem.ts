import { computed } from 'vue'
import { useRouter } from 'vue-router'

export function useDatabaseSystem() {
  const router = useRouter()

  return computed({
    get: () => {
      return router.currentRoute.value.path.replace('/', '')
    },
    set: (value: string) => {
      router.push(`/${value}`).then()
    }
  })
}