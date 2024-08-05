export const RunnerEvent = {
  QueriesUpdated: 'queries-updated',
} as const
export type RunnerEvent = (typeof RunnerEvent)[keyof typeof RunnerEvent]

export type RunnerEventMap = {
  [RunnerEvent.QueriesUpdated]: []
}
