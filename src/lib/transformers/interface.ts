import { PipelineProgressStatus } from '@/lib/transformers/enums'
import type { PipelineType } from '@xenova/transformers/types/pipelines'

export type RawProgressFlat = {
  status: PipelineProgressStatus
  name: string
  file: string
  progress?: number
  loaded?: number
  total?: number
  task?: string
  model?: string
}

type PartialPipelineArgumentsMap = {
  ['feature-extraction']: [text: string]
}

type PartialPipelineOutputMap = {
  ['feature-extraction']: { data: Float32Array }
}

type PipelineArgumentsMap = {
  [K in keyof Omit<PipelineType, keyof PartialPipelineOutputMap>]: unknown[]
} & PartialPipelineArgumentsMap

type PipelineOutputMap = {
  [K in keyof Omit<PipelineType, keyof PartialPipelineOutputMap>]: unknown
} & PartialPipelineOutputMap

export type PipelineArguments<T extends PipelineType> = PipelineArgumentsMap[T &
  keyof PipelineArgumentsMap]

export type PipelineOutput<T extends PipelineType> = PipelineOutputMap[T &
  keyof PipelineOutputMap]

export type Pipeline<T extends PipelineType> = (
  ...args: PipelineArguments<T>
) => Promise<PipelineOutput<T>>
export type FeatureExtractionPipeline = Pipeline<'feature-extraction'>
