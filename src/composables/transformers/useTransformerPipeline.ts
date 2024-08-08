import { TransformerPipeline } from '@/lib/transformers/pipeline'
import type { PipelineType } from '@xenova/transformers/types/pipelines'
import { useMutation } from '@tanstack/vue-query'
import { useManualReadonlyRef } from '@/composables/useManualReadonlyRef'

export function useTransformerPipeline<T extends PipelineType>(
  singleton: TransformerPipeline<T>,
) {
  const [progress, updateProgress] = useManualReadonlyRef(0)

  const {
    mutateAsync: getPipeline,
    error,
    isPending,
  } = useMutation({
    mutationFn: () => singleton.getInstance(updateProgress),
  })

  return {
    getPipeline,
    error,
    progress,
    isPending,
  }
}
