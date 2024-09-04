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
  [RegistryEvent.Registered]: [dataSourceKey: string]
  [RegistryEvent.Unregistered]: [dataSourceKey: string]
  [RegistryEvent.Initializing]: [dataSourceKey: string]
  [RegistryEvent.Initialized]: [dataSourceKey: string, durationMs: number]
  [RegistryEvent.Closing]: [dataSourceKey: string]
  [RegistryEvent.Closed]: [dataSourceKey: string]
}
