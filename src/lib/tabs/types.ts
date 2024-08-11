import { TabType } from '@/lib/tabs/enums'
import type { Logger } from '@/lib/logger/impl/logger'

export type BaseTabData = {
  type: TabType
  displayName?: string
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
  logger: Logger
}

export type TabData = EmptyTabData | ConsoleTabData | LoggerTabData

export type BaseTabInfo = BaseTabData & {
  id: string
  displayName: string
  persistent: boolean
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

export type TabInfo = EmptyTabInfo | ConsoleTabInfo | LoggerTabInfo
