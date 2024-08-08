import { TransformerPipeline } from '@/lib/transformers/pipeline'
import type { PipelineType } from '@xenova/transformers/types/pipelines'
import { useManualReadonlyRef } from '@/composables/useManualReadonlyRef'

export function useTransformerPipeline<T extends PipelineType>(
  singleton: TransformerPipeline<T>,
) {
  const [progress] = useManualReadonlyRef(0)

  return {
    pipeline: singleton.pipeline.bind(singleton),
    progress,
  }
}
