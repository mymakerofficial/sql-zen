export const RegistryEvent = {
  Registered: 'registered',
  Unregistered: 'unregistered',
  Initializing: 'initializing',
  Initialized: 'initialized',
  Closing: 'closing',
  Closed: 'closed',
} as const
export type RegistryEvent = (typeof RegistryEvent)[keyof typeof RegistryEvent]

export type RegistryEventMap = {
  [RegistryEvent.Registered]: [dataSourceId: string]
  [RegistryEvent.Unregistered]: [dataSourceId: string]
  [RegistryEvent.Initializing]: [dataSourceId: string]
  [RegistryEvent.Initialized]: [dataSourceId: string, durationMs: number]
  [RegistryEvent.Closing]: [dataSourceId: string]
  [RegistryEvent.Closed]: [dataSourceId: string]
}
