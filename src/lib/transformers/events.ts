import type { PipelineType } from '@xenova/transformers/types/pipelines'
import type { PipelineOutput } from '@/lib/transformers/interface'

export const PipelineWorkerEvent = {
  Loading: 'loading',
  Progress: 'progress',
  Ready: 'ready',
} as const
export type PipelineWorkerEvent =
  (typeof PipelineWorkerEvent)[keyof typeof PipelineWorkerEvent]

export const PipelineEvent = {
  ...PipelineWorkerEvent,
  Done: 'done',
  Error: 'error',
} as const
export type PipelineEvent = (typeof PipelineEvent)[keyof typeof PipelineEvent]

export type PipelineWorkerEventMap = {
  [PipelineEvent.Loading]: []
  [PipelineWorkerEvent.Progress]: [number]
  [PipelineEvent.Ready]: []
}

export type PipelineEventMap<T extends PipelineType> =
  PipelineWorkerEventMap & {
    [PipelineEvent.Done]: [PipelineOutput<T>]
    [PipelineEvent.Error]: [unknown]
  }
