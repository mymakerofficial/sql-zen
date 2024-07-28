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
  [RegistryEvent.Registered]: [string]
  [RegistryEvent.Unregistered]: [string]
  [RegistryEvent.Initializing]: [string]
  [RegistryEvent.Initialized]: [string]
  [RegistryEvent.Closing]: [string]
  [RegistryEvent.Closed]: [string]
}
