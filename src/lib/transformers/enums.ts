export const PipelineProgressStatus = {
  Initiate: 'initiate',
  Download: 'download',
  Progress: 'progress',
  Done: 'done',
  Ready: 'ready',
} as const
export type PipelineProgressStatus =
  (typeof PipelineProgressStatus)[keyof typeof PipelineProgressStatus]

export const PipelineState = {
  Idle: 'idle',
  Loading: 'loading',
  Ready: 'ready',
}
export type PipelineState = (typeof PipelineState)[keyof typeof PipelineState]
