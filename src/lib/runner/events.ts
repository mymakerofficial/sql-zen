export const RunnerEvent = {
  QueryUpdated: 'query-updated',
} as const
export type RunnerEvent = (typeof RunnerEvent)[keyof typeof RunnerEvent]

export type RunnerEventMap = {
  [RunnerEvent.QueryUpdated]: [string]
}
