import type {
  DataSourceDriver,
  DataSourceDriverCapability,
} from '@/lib/engines/enums'
import { computed, type ComputedRef, type MaybeRefOrGetter, toValue } from 'vue'
import { getDriverCapabilities } from '@/lib/engines/helpers'
import type { DataSourceDriverCapabilities } from '@/lib/engines/interface'

export function useDriverSupports<C extends DataSourceDriverCapability>(
  driver: MaybeRefOrGetter<DataSourceDriver>,
  capability: MaybeRefOrGetter<C>,
): ComputedRef<DataSourceDriverCapabilities[C]> {
  return computed(() => {
    return getDriverCapabilities(toValue(driver))[toValue(capability)]
  })
}
