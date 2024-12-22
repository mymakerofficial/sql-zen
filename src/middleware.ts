import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { useRegistry } from '@/composables/useRegistry'
import { useEnv } from '@/composables/useEnv'
import { useDialog } from '@/composables/useDialog'
import CreateDataSourceDialog from '@/components/shared/dialogs/dataSource/CreateDataSourceDialog.vue'
import {
  DataSourceDriverCapability,
  isDatabaseEngine,
} from '@/lib/engines/enums'
import {
  getDriverCapability,
  getDriverForEngineAndMode,
  getEngineInfo, getFirstAvailableModeForEngine,
} from '@/lib/engines/helpers'
import { DataSourceMode } from '@/lib/dataSources/enums'
import {
  getDataSourceDefaults,
  getIdentifier,
} from '@/components/shared/dialogs/dataSource/helpers'

export const MiddlewareProvider = defineComponent(() => {
  const router = useRouter()
  const registry = useRegistry()
  const { isTauri } = useEnv()
  const { open: openCreateDataSource } = useDialog(CreateDataSourceDialog)

  router.beforeEach((to) => {
    if (isTauri && to.path === '/') {
      return '/app'
    }
  })

  router.afterEach((to) => {
    const { createDataSource, engine, ...query } = to.query

    if (!createDataSource) {
      return
    }

    if (!isDatabaseEngine(engine)) {
      router.replace({ path: '/app', query }).then(() => {
        openCreateDataSource()
      })
      return
    }

    const mode = getFirstAvailableModeForEngine(engine)

    // if this engine can be created in memory, do that.
    //  otherwise, the user might need to enter some configuration so we'll open the dialog

    if (!mode === DataSourceMode.Memory) {
      router.replace({ path: '/app', query }).then(() => {
        openCreateDataSource({
          data: { engine, mode },
        })
      })
      return
    }

    const driver = getDriverForEngineAndMode(engine, mode)

    const requiresDesktop = getDriverCapability(
      driver,
      DataSourceDriverCapability.RequiresDesktopApp,
    )

    if (requiresDesktop) {
      router.replace({ path: '/app', query }).then(() => {
        openCreateDataSource({
          data: { engine, driver, mode },
        })
      })
      return
    }

    const engineInfo = getEngineInfo(engine)
    const identifier = getIdentifier(engine)

    router.replace({ path: '/app', query }).then(() => {
      registry.register({
        ...getDataSourceDefaults(),
        engine,
        driver,
        mode,
        displayName: engineInfo.name,
        identifier,
      })
    })
  })

  return () => null
})
