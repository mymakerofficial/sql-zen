export const PipelineProgressStatus = {
  Initiate: 'initiate',
  Download: 'download',
  Progress: 'progress',
  Done: 'done',
  Ready: 'ready',
} as const
export type PipelineProgressStatus =
  (typeof PipelineProgressStatus)[keyof typeof PipelineProgressStatus]
