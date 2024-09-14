import { TabType } from '@/lib/tabs/enums'
import type { EmptyTab } from '@/lib/tabs/tabs/empty'
import type { ConsoleTab } from '@/lib/tabs/tabs/console'
import type { LoggerTab } from '@/lib/tabs/tabs/logger'
import type { QueryTab } from '@/lib/tabs/tabs/query'
import type { TestTab } from '@/lib/tabs/tabs/test'

export type BaseTabData = {
  type: TabType
  displayName?: string
}

export type TestTabData = Omit<BaseTabData, 'type'> & {
  type: typeof TabType.Test
  preventClose?: boolean
  canRename?: boolean
  defaultDisplayName?: string
}

export type EmptyTabData = Omit<BaseTabData, 'type'> & {
  type: typeof TabType.Empty
}

export type ConsoleTabData = Omit<BaseTabData, 'type'> & {
  type: typeof TabType.Console
  dataSourceKey: string
  modelValue?: string
}

export type LoggerTabData = Omit<BaseTabData, 'type'> & {
  type: typeof TabType.Logger
  loggerId: string
}

export type QueryTabData = Omit<BaseTabData, 'type'> & {
  type: typeof TabType.Query
  dataSourceKey: string
  queryId: string
}

export type TabData =
  | TestTabData
  | EmptyTabData
  | ConsoleTabData
  | LoggerTabData
  | QueryTabData

export type BaseTabInfo = BaseTabData & {
  id: string
  displayName: string
  preventClose: boolean
  canRename: boolean
}

export type TestTabInfo = Omit<BaseTabInfo, 'type'> & {
  type: typeof TabType.Test
  preventClose: boolean
  canRename: boolean
  defaultDisplayName: string
}

export type EmptyTabInfo = Omit<BaseTabInfo, 'type'> & {
  type: typeof TabType.Empty
}

export type ConsoleTabInfo = Omit<BaseTabInfo, 'type'> & {
  type: typeof TabType.Console
  dataSourceKey: string
  engineName: string
  engineIcon: string
}

export type LoggerTabInfo = Omit<BaseTabInfo, 'type'> & {
  type: typeof TabType.Logger
  loggerId: string
}

export type QueryTabInfo = Omit<BaseTabInfo, 'type'> & {
  type: typeof TabType.Query
  dataSourceKey: string
  queryId: string
}

export type TabInfo =
  | TestTabInfo
  | EmptyTabInfo
  | ConsoleTabInfo
  | LoggerTabInfo
  | QueryTabInfo

export type TabInfoMap = {
  [TabType.Test]: TestTabInfo
  [TabType.Empty]: EmptyTabInfo
  [TabType.Console]: ConsoleTabInfo
  [TabType.Logger]: LoggerTabInfo
  [TabType.Query]: QueryTabInfo
}

export type TabClassMap = {
  [TabType.Test]: TestTab
  [TabType.Empty]: EmptyTab
  [TabType.Console]: ConsoleTab
  [TabType.Logger]: LoggerTab
  [TabType.Query]: QueryTab
}

export type TabClass<T extends TabType> = TabClassMap[T]
