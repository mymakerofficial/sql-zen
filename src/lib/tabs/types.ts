import { TabType } from '@/lib/tabs/enums'

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

export type TabData = EmptyTabData | ConsoleTabData

export type BaseTabInfo = BaseTabData & {
  id: string
  displayName: string
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

export type TabInfo = EmptyTabInfo | ConsoleTabInfo
