export const TabManagerEvent = {
  TabAdded: 'tab-added',
  TabRemoved: 'tab-removed',
  ActiveTabChanged: 'active-tab-changed',
} as const
export type TabManagerEvent =
  (typeof TabManagerEvent)[keyof typeof TabManagerEvent]

export type TabManagerEventMap = {
  [TabManagerEvent.TabAdded]: [id: string]
  [TabManagerEvent.TabRemoved]: [id: string]
  [TabManagerEvent.ActiveTabChanged]: [newId: string, oldId: string]
}

export const TabEvent = {
  DisplayNameChanged: 'display-name-changed',
} as const
export type TabEvent = (typeof TabEvent)[keyof typeof TabEvent]

export type TabEventMap = {
  [TabEvent.DisplayNameChanged]: [value: string]
}
