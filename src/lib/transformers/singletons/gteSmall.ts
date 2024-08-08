import { TransformerPipeline } from '@/lib/transformers/pipeline'

export const GteSmall = new TransformerPipeline(
  'feature-extraction',
  new Worker(new URL('../workers/gteSmallWorker.ts', import.meta.url), {
    type: 'module',
  }),
)
