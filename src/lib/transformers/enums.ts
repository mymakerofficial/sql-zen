export const PipelineProgressStatus = {
  Initiate: 'initiate',
  Download: 'download',
  Progress: 'progress',
  Done: 'done',
  Ready: 'ready',
} as const
export type PipelineProgressStatus =
  (typeof PipelineProgressStatus)[keyof typeof PipelineProgressStatus]

export const PipelineWorkerMessageType = {
  Progress: 'progress',
  Ready: 'ready',
  Done: 'done',
  Error: 'error',
}
export type PipelineWorkerMessageType =
  (typeof PipelineWorkerMessageType)[keyof typeof PipelineWorkerMessageType]
