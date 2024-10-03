import type { Registry } from '@/lib/registry/impl/registry'
import { RegistryEvent } from '@/lib/registry/events'
import { useSeline } from '@/composables/seline/seline'
import { runnerAnalytics } from '@/lib/runner/plugins/analytics'

const { track } = useSeline()

export function registryAnalytics(registry: Registry) {
  registry.on(RegistryEvent.Registered, (key) => {
    const dataSource = registry.getDataSource(key)
    track('data-source: registered', {
      ...dataSource.getAnonymizedAnalyticsData(),
      createdWithDump: !dataSource.fileAccessor.isDummy,
    })
  })

  registry.on(RegistryEvent.Initialized, (key, durationMs) => {
    const dataSource = registry.getDataSource(key)
    track('data-source: initialized', {
      ...dataSource.getAnonymizedAnalyticsData(),
      durationRounded: Math.round(durationMs / 1000) + 's',
    })

    dataSource.runner.use(runnerAnalytics)
  })

  registry.on(RegistryEvent.Unregistered, () => {
    track('data-source: unregistered')
  })
}
