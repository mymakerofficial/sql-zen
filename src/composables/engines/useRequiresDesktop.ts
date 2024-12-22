import { DatabaseEngine, DataSourceDriver } from '@/lib/engines/enums'
import type { ComputedRef, MaybeRefOrGetter } from 'vue'
import { computed, toValue } from 'vue'
import { getEngineOrModeOrDriverRequiresDesktop } from '@/lib/engines/helpers'
import { DataSourceMode } from '@/lib/dataSources/enums'

export function useRequiresDesktop(
  engine: MaybeRefOrGetter<DatabaseEngine>,
  mode?: MaybeRefOrGetter<DataSourceMode | undefined | null>,
  driver?: MaybeRefOrGetter<DataSourceDriver | undefined | null>,
): ComputedRef<boolean> {
  return computed(() => {
    return getEngineOrModeOrDriverRequiresDesktop(
      toValue(engine) || DatabaseEngine.None,
      toValue(mode) || DataSourceMode.None,
      toValue(driver) || DataSourceDriver.None,
    )
  })
}
