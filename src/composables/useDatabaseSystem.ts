import { computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  DatabaseSystem,
  databaseSystems,
  databaseSystemsList,
} from '@/lib/databaseSystems'

function onlyBase(path: string) {
  const secondSlashIndex = path.indexOf('/', path.indexOf('/') + 1)

  if (secondSlashIndex === -1) {
    return path
  }

  return path.substring(0, secondSlashIndex)
}

export function useDatabaseSystem() {
  const router = useRouter()

  return computed({
    get: () => {
      return (
        databaseSystemsList.find((it) => {
          return (
            onlyBase(it.baseRoute) == onlyBase(router.currentRoute.value.path)
          )
        })?.key ?? ''
      )
    },
    set: (value: DatabaseSystem | '') => {
      if (!value) {
        return
      }
      router.push(databaseSystems[value].baseRoute).then()
    },
  })
}
