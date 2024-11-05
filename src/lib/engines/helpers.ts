import { type DatabaseEngine, DataSourceDriver } from '@/lib/engines/enums'
import {
  databaseEnginesMap,
  dataSourceDriverCapabilities,
  dataSourceDrivers,
  dataSourceDriversMap,
} from '@/lib/engines/constants'
import type {
  DatabaseEngineInfo,
  DataSourceDriverCapabilities,
  DataSourceDriverInfo,
} from '@/lib/engines/interface'
import type { DataSourceMode } from '@/lib/dataSources/enums'
import { isTauri as getIsTauri } from '@tauri-apps/api/core'

export function getEngineInfo(engine: DatabaseEngine) {
  return { engine, ...databaseEnginesMap[engine] } as DatabaseEngineInfo
}

export function getDriverInfo(driver: DataSourceDriver) {
  return { driver, ...dataSourceDriversMap[driver] } as DataSourceDriverInfo
}

export function getDriverCapabilities(driver: DataSourceDriver) {
  return dataSourceDriverCapabilities[driver] as DataSourceDriverCapabilities
}

export function getDriverCapability<
  C extends keyof DataSourceDriverCapabilities,
>(driver: DataSourceDriver, capability: C) {
  return getDriverCapabilities(driver)[capability]
}

export function getDataSourceDriversForEngine(engine: DatabaseEngine) {
  return dataSourceDrivers.filter((info) => info.engines.includes(engine))
}

export function getAvailableModesForEngine(engine: DatabaseEngine) {
  const list = getDataSourceDriversForEngine(engine)
    .map((info) => getDriverCapabilities(info.driver))
    .flatMap((capabilities) => capabilities.modes)

  return Array.from(new Set(list))
}

export function getDriverForEngineAndMode(
  engine: DatabaseEngine,
  mode: DataSourceMode,
) {
  const isTauri = getIsTauri()

  const drivers = [...getDataSourceDriversForEngine(engine)].sort((a, b) => {
    const aCapabilities = getDriverCapabilities(a.driver)
    const bCapabilities = getDriverCapabilities(b.driver)

    // if is tauri, prioritize drivers that require the desktop app

    if (aCapabilities.requiresDesktopApp) {
      return isTauri ? -1 : 1
    }

    if (bCapabilities.requiresDesktopApp) {
      return isTauri ? 1 : -1
    }

    return 0
  })

  const driver = drivers.find((info) => {
    return getDriverCapabilities(info.driver).modes.includes(mode)
  })

  return driver?.driver ?? DataSourceDriver.None
}
