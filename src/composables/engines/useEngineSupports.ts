import type {
  DatabaseEngine,
  DatabaseEngineCapability,
} from '@/lib/engines/enums'
import { computed, type MaybeRefOrGetter, toValue } from 'vue'
import { getEngineCapabilities } from '@/lib/engines/helpers'

export function useEngineSupports(
  engine: MaybeRefOrGetter<DatabaseEngine>,
  capability: MaybeRefOrGetter<DatabaseEngineCapability>,
) {
  return computed(() => {
    return getEngineCapabilities(toValue(engine))[toValue(capability)]
  })
}
