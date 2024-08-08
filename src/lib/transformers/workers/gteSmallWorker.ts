import { TransformerPipelineWorker } from '@/lib/transformers/pipelineWorker'
import type { PipelineArguments } from '@/lib/transformers/interface'
import { PipelineEvent, PipelineWorkerEvent } from '@/lib/transformers/events'

const Pipeline = new TransformerPipelineWorker(
  'feature-extraction',
  'Supabase/gte-small',
)

Pipeline.on(PipelineWorkerEvent.Loading, () => {
  self.postMessage({ type: PipelineEvent.Loading })
})

Pipeline.on(PipelineWorkerEvent.Progress, (progress) => {
  self.postMessage({ type: PipelineEvent.Progress, progress })
})

Pipeline.on(PipelineWorkerEvent.Ready, () => {
  self.postMessage({ type: PipelineEvent.Ready })
})

self.addEventListener('message', async (event) => {
  const pipeline = await Pipeline.getInstance()

  const [text] = event.data.args as PipelineArguments<'feature-extraction'>

  await pipeline(text, {
    pooling: 'mean',
    normalize: true,
  }).then(
    ({ data }) => {
      self.postMessage({
        type: PipelineEvent.Done,
        output: { data },
      })
    },
    (error) => {
      self.postMessage({ type: PipelineEvent.Error, error })
    },
  )
})
