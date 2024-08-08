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
  private progressMap: Map<string, number> = new Map()

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

    const sum = entries.reduce((acc, it) => acc + it, 0)
    return sum / entries.length
  }

  private handleProgress(event: RawProgressFlat) {
    if (event.status === PipelineProgressStatus.Ready) {
      // ignore ready events
      return
    }

    const key = `${event.name}-${event.file}`
    this.progressMap.set(
      key,
      event.progress ??
        (event.status === PipelineProgressStatus.Done ? 100 : 0),
    )

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
