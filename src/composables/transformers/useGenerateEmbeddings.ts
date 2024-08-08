import { useState } from '@/composables/useState'
import { useMutation } from '@tanstack/vue-query'
import type { FeatureExtractionPipeline } from '@/lib/transformers/interface'

export type GenerateEmbeddingsInput = {
  id: string
  text: string
}

export type GenerateEmbeddingsOutput = {
  id: string
  embedding: Float32Array
}

export function useGenerateEmbeddings(pipeline: FeatureExtractionPipeline) {
  const [progress, setProgress] = useState(0)

  const { mutate, mutateAsync, ...mutation } = useMutation({
    mutationFn: async (rows: GenerateEmbeddingsInput[]) => {
      const out: GenerateEmbeddingsOutput[] = []
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i]
        const { data } = await pipeline(row.text)
        setProgress(((i + 1) / rows.length) * 100)
        out.push({
          id: row.id,
          embedding: data,
        })
      }
      return out
    },
  })

  return { generate: mutate, generateAsync: mutateAsync, ...mutation, progress }
}
