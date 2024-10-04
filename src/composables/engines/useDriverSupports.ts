import type {
  DataSourceDriver,
  DataSourceDriverCapability,
} from '@/lib/engines/enums'
import { computed, type MaybeRefOrGetter, toValue } from 'vue'
import { getDriverCapabilities } from '@/lib/engines/helpers'

export function useDriverSupports(
  driver: MaybeRefOrGetter<DataSourceDriver>,
  capability: MaybeRefOrGetter<DataSourceDriverCapability>,
) {
  return computed(() => {
    return getDriverCapabilities(toValue(driver))[toValue(capability)]
  })
}
