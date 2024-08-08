import { TransformerPipelineWorker } from '@/lib/transformers/pipeline'
import { PipelineWorkerMessageType } from '@/lib/transformers/enums'
import type { PipelineArguments } from '@/lib/transformers/interface'

const Pipeline = new TransformerPipelineWorker(
  'feature-extraction',
  'Supabase/gte-small',
)

self.addEventListener('message', async (event) => {
  const pipeline = await Pipeline.getInstance(
    (progress) =>
      self.postMessage({ type: PipelineWorkerMessageType.Progress, progress }),
    () => self.postMessage({ type: PipelineWorkerMessageType.Ready }),
  )

  const [text] = event.data.args as PipelineArguments<'feature-extraction'>

  await pipeline(text, {
    pooling: 'mean',
    normalize: true,
  }).then(
    ({ data }) => {
      self.postMessage({
        type: PipelineWorkerMessageType.Done,
        output: { data },
      })
    },
    (error) => {
      self.postMessage({ type: PipelineWorkerMessageType.Error, error })
    },
  )
})
