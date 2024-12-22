import {
  DatabaseEngine,
  DataSourceDriver,
  DataSourceDriverCapability,
} from '@/lib/engines/enums'
import type { ComputedRef, MaybeRefOrGetter } from 'vue'
import { computed, toValue } from 'vue'
import {
  getDriverCapability,
  getEngineAndModeRequiresDesktop,
  getEngineRequiresDesktop,
} from '@/lib/engines/helpers'
import { DataSourceMode } from '@/lib/dataSources/enums'

export function useRequiresDesktop(
  engine: MaybeRefOrGetter<DatabaseEngine>,
  mode?: MaybeRefOrGetter<DataSourceMode | undefined | null>,
  driver?: MaybeRefOrGetter<DataSourceDriver | undefined | null>,
): ComputedRef<boolean> {
  return computed(() => {
    if (toValue(driver) && toValue(driver) !== DataSourceDriver.None) {
      return getDriverCapability(
        toValue(driver),
        DataSourceDriverCapability.RequiresDesktopApp,
      )
    }

    if (toValue(mode) && toValue(mode) !== DataSourceMode.None) {
      return getEngineAndModeRequiresDesktop(toValue(driver))
    }

    return getEngineRequiresDesktop(toValue(engine) || DatabaseEngine.None)
  })
}
