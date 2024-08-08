import type {
  AllTasks,
  PipelineType,
} from '@xenova/transformers/types/pipelines'
import { env, pipeline } from '@xenova/transformers'
import type {
  PipelineArguments,
  PipelineOutput,
  PipelineProgress,
  RawProgressFlat,
} from '@/lib/transformers/interface'
import {
  PipelineProgressStatus,
  PipelineWorkerMessageType,
} from '@/lib/transformers/enums'

// skip local model scan
env.allowLocalModels = false

// used inside the worker
export class TransformerPipelineWorker<T extends PipelineType> {
  #instance: AllTasks[T] | null = null
  #progressEntries: Map<string, PipelineProgress> = new Map()

  constructor(
    private readonly task: T,
    private readonly model: string,
  ) {}

  getProgress(): number {
    const entries = [...this.#progressEntries.values()].map((it) => it.progress)

    if (entries.length === 0) {
      return 0
    }

    const sum = entries.reduce((acc, it) => acc + it, 0)
    return sum / entries.length
  }

  async loadModel(callback?: (progress: number) => void): Promise<AllTasks[T]> {
    return await pipeline(this.task, this.model, {
      progress_callback: (event: RawProgressFlat) => {
        if (!callback) {
          return
        }

        if (event.status === PipelineProgressStatus.Ready) {
          // ignore ready event
          return
        }

        const key = `${event.name}-${event.file}`
        const progress =
          event.progress ??
          (event.status === PipelineProgressStatus.Done ? 100 : 0)
        this.#progressEntries.set(key, {
          status: event.status,
          key,
          name: event.name,
          file: event.file,
          progress,
          loaded: event.loaded ?? 0,
          total: event.total ?? 0,
        })

        callback(this.getProgress())
      },
    })
  }

  async getInstance(
    onProgress?: (progress: number) => void,
    onReady?: () => void,
  ): Promise<AllTasks[T]> {
    if (!this.#instance) {
      this.#instance = await this.loadModel(onProgress)
      onReady?.()
    }
    return this.#instance
  }
}

export class TransformerPipeline<T extends PipelineType> {
  constructor(
    // task is just for typing
    _task: T,
    private readonly worker: Worker,
  ) {}

  pipeline(...args: PipelineArguments<T>): Promise<PipelineOutput<T>> {
    return new Promise((resolve, reject) => {
      this.worker.onmessage = (event) => {
        if (event.data.type === PipelineWorkerMessageType.Done) {
          resolve(event.data.output)
        } else if (event.data.type === PipelineWorkerMessageType.Error) {
          reject(event.data.error)
        }
      }

      this.worker.postMessage({ args })
    })
  }
}
