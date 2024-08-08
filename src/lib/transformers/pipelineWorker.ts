import type {
  AllTasks,
  PipelineType,
} from '@xenova/transformers/types/pipelines'
import { env, pipeline } from '@xenova/transformers'
import type { RawProgressFlat } from '@/lib/transformers/interface'
import { PipelineProgressStatus } from '@/lib/transformers/enums'
import { EventPublisher } from '@/lib/events/publisher'
import {
  PipelineWorkerEvent,
  type PipelineWorkerEventMap,
} from '@/lib/transformers/events'

// skip local model scan
env.allowLocalModels = false

// used inside the worker
export class TransformerPipelineWorker<
  T extends PipelineType,
> extends EventPublisher<PipelineWorkerEventMap> {
  private instance: AllTasks[T] | null = null
  private progressMap: Map<
    string,
    {
      loaded: number
      total: number
    }
  > = new Map()

  constructor(
    private readonly task: T,
    private readonly model: string,
  ) {
    super()
  }

  getProgress(): number {
    const entries = [...this.progressMap.values()]

    if (entries.length === 0) {
      return 0
    }

    const totalSum = entries.reduce((acc, it) => acc + it.total, 0)
    const loadedSum = entries.reduce((acc, it) => acc + it.loaded, 0)
    return (loadedSum / totalSum) * 100
  }

  private handleProgress(event: RawProgressFlat) {
    if (
      event.status === PipelineProgressStatus.Ready ||
      event.status === PipelineProgressStatus.Done
    ) {
      // ignore ready events
      return
    }

    const key = `${event.name}-${event.file}`
    this.progressMap.set(key, {
      loaded: event.loaded ?? 0,
      total: event.total ?? 100000, // im just guessing here
    })

    this.emit(PipelineWorkerEvent.Progress, this.getProgress())
  }

  private async loadModel(): Promise<AllTasks[T]> {
    this.emit(PipelineWorkerEvent.Loading)
    const instance = await pipeline(this.task, this.model, {
      progress_callback: this.handleProgress.bind(this),
    })
    this.emit(PipelineWorkerEvent.Ready)
    return instance
  }

  async getInstance(): Promise<AllTasks[T]> {
    if (!this.instance) {
      this.instance = await this.loadModel()
    }
    return this.instance
  }
}
