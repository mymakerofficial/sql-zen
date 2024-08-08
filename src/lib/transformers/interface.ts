import { PipelineProgressStatus } from '@/lib/transformers/enums'

export type RawProgress =
  | {
      status: typeof PipelineProgressStatus.Initiate
      name: string
      file: string
    }
  | {
      status: typeof PipelineProgressStatus.Download
      name: string
      file: string
    }
  | {
      status: typeof PipelineProgressStatus.Progress
      name: string
      file: string
      progress: number
      loaded: number
      total: number
    }
  | {
      status: typeof PipelineProgressStatus.Done
      name: string
      file: string
    }
  | {
      status: typeof PipelineProgressStatus.Ready
      task: string
      model: string
    }

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

export type PipelineProgress = {
  status: PipelineProgressStatus
  key: string
  name: string
  file: string
  progress: number
  loaded: number
  total: number
}
