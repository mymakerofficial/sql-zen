import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { DatabaseSystem, databaseSystems, databaseSystemsList } from '@/lib/databaseSystems'

export function useDatabaseSystem() {
  const router = useRouter()

  return computed({
    get: () => {
      return databaseSystemsList.find((it) => {
        return it.baseRoute == router.currentRoute.value.path
      })?.key ?? ''
    },
    set: (value: DatabaseSystem | '') => {
      if (!value) {
        return
      }
      router.push(databaseSystems[value].baseRoute).then()
    }
  })
}