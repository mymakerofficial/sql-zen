import type { TabInfo } from '@/lib/tabs/types'

export const TabManagerEvent = {
  TabAdded: 'tab-added',
  TabRemoved: 'tab-removed',
  ActiveTabChanged: 'active-tab-changed',
  TabRequestedSave: 'tab-requested-save',
} as const
export type TabManagerEvent =
  (typeof TabManagerEvent)[keyof typeof TabManagerEvent]

export type TabManagerEventMap = {
  [TabManagerEvent.TabAdded]: [info: TabInfo]
  [TabManagerEvent.TabRemoved]: [info: TabInfo]
  [TabManagerEvent.ActiveTabChanged]: [newId: string, oldId: string]
  [TabManagerEvent.TabRequestedSave]: [info: TabInfo]
}

export const TabEvent = {
  DisplayNameChanged: 'display-name-changed',
  RequestSave: 'request-save',
} as const
export type TabEvent = (typeof TabEvent)[keyof typeof TabEvent]

export type TabEventMap = {
  [TabEvent.DisplayNameChanged]: [value: string]
  [TabEvent.RequestSave]: []
}
