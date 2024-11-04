import { DataSourceMode } from '@/lib/dataSources/enums'
import type { Component } from 'vue'
import {
  CableIcon,
  CpuIcon,
  FileQuestionIcon,
  HardDriveIcon,
} from 'lucide-vue-next'
import { isTauri } from '@tauri-apps/api/core'

export type DataSourceModeInfo = {
  mode: DataSourceMode
  name: string
  description: string
  icon: Component
}

export const dataSourceModesMap = {
  [DataSourceMode.None]: {
    name: 'None',
    description: 'The data is stored nowhere. o.o',
    icon: FileQuestionIcon,
  },
  [DataSourceMode.Connection]: {
    name: 'Connection',
    description: 'Connect to a local or remote database.',
    icon: CableIcon,
  },
  [DataSourceMode.Memory]: {
    name: 'In-memory',
    description: isTauri()
      ? 'Data is kept in memory and will be lost when the application is closed or reloaded.'
      : 'Data is kept in memory and will be lost when the page is closed or reloaded.',
    icon: CpuIcon,
  },
  [DataSourceMode.BrowserPersisted]: {
    name: 'Persisted',
    description: isTauri()
      ? 'Data will be stored in SqlZen. Depending on the driver, there may be no way to export the data.'
      : "Data will be saved in your browser. Data will be lost if you clear your browser's data.",
    icon: HardDriveIcon,
  },
} as const satisfies Record<DataSourceMode, Omit<DataSourceModeInfo, 'mode'>>

export const dataSourceModes = Object.entries(dataSourceModesMap).map(
  ([mode, info]) => ({
    mode,
    ...info,
  }),
) as Array<DataSourceModeInfo>
