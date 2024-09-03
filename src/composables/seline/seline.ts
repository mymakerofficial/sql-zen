import * as seline from '@seline-analytics/web'
import { createGlobalState, useLocalStorage } from '@vueuse/core'
import { getId } from '@/lib/getId'

const useAnalyticsUser = createGlobalState(() => {
  // generate a random id **not based on any device data**
  const userId = useLocalStorage('random-userid', getId('user'))

  return {
    userId: userId.value,
    name: userId.value,
  }
})

export function initSeline()  {
  seline.init();
  seline.setUser(useAnalyticsUser())
}
