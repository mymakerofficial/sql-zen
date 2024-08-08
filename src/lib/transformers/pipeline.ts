import type { PipelineType } from '@xenova/transformers/types/pipelines'
import type {
  PipelineArguments,
  PipelineOutput,
} from '@/lib/transformers/interface'
import { PipelineState } from '@/lib/transformers/enums'
import { EventPublisher } from '@/lib/events/publisher'
import { PipelineEvent, type PipelineEventMap } from '@/lib/transformers/events'

export class TransformerPipeline<T extends PipelineType> extends EventPublisher<
  PipelineEventMap<T>
> {
  #progress: number = 0
  #state: PipelineState = PipelineState.Idle

  constructor(
    // task is just for typing
    _task: T,
    private readonly worker: Worker,
  ) {
    super()

    this.worker.onmessage = (event) => {
      if (event.data.type === PipelineEvent.Loading) {
        this.#state = PipelineState.Loading
        this.emit(PipelineEvent.Loading)
      } else if (event.data.type === PipelineEvent.Progress) {
        this.#progress = event.data.progress
        this.emit(PipelineEvent.Progress, event.data.progress)
      } else if (event.data.type === PipelineEvent.Ready) {
        this.#state = PipelineState.Ready
        this.emit(PipelineEvent.Ready)
      } else if (event.data.type === PipelineEvent.Done) {
        this.emit(PipelineEvent.Done, event.data.output)
      } else if (event.data.type === PipelineEvent.Error) {
        this.emit(PipelineEvent.Error, event.data.error)
      } else {
        throw new Error(
          `Received unknown event type from worker: ${event.data.type}`,
        )
      }
    }
  }

  get progress(): number {
    return this.#progress
  }

  get state(): PipelineState {
    return this.#state
  }

  pipeline(...args: PipelineArguments<T>): Promise<PipelineOutput<T>> {
    return new Promise((resolve, reject) => {
      this.once(PipelineEvent.Done, resolve)
      this.once(PipelineEvent.Error, reject)

      this.worker.postMessage({ args })
    })
  }
}
