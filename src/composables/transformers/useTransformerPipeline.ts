import { TransformerPipeline } from '@/lib/transformers/pipeline'
import type { PipelineType } from '@xenova/transformers/types/pipelines'
import { useExternalStore } from '@/composables/useExternalStore'
import { PipelineEvent } from '@/lib/transformers/events'
import { computed, onMounted, onUnmounted } from 'vue'
import { PipelineState } from '@/lib/transformers/enums'

export function useTransformerPipeline<T extends PipelineType>(
  singleton: TransformerPipeline<T>,
) {
  const [progress, setProgress] = useExternalStore(singleton.progress)
  const [state, setState] = useExternalStore(singleton.state)

  function handleStateChange() {
    setState(singleton.state)
  }

  onMounted(() => {
    singleton.on(PipelineEvent.Progress, setProgress)
    singleton.on(PipelineEvent.Loading, handleStateChange)
    singleton.on(PipelineEvent.Ready, handleStateChange)
  })

  onUnmounted(() => {
    singleton.off(PipelineEvent.Progress, setProgress)
    singleton.off(PipelineEvent.Loading, handleStateChange)
    singleton.off(PipelineEvent.Ready, handleStateChange)
  })

  const isIdle = computed(() => state.value === PipelineState.Idle)
  const isLoading = computed(() => state.value === PipelineState.Loading)
  const isReady = computed(() => state.value === PipelineState.Ready)

  return {
    pipeline: singleton.pipeline.bind(singleton),
    progress,
    state,
    isIdle,
    isLoading,
    isReady,
  }
}
