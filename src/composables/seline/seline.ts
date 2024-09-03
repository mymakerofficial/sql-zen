import * as seline from '@seline-analytics/web'
import { useDebounceFn } from '@vueuse/core'

const isProd = import.meta.env.PROD

function initSeline() {
  if (!isProd) return
  seline.init()
}

function undebouncedTrack(name: string, data?: Record<string, unknown> | null) {
  // the user should see what's being tracked
  console.info(
    '%ctracking event',
    'color: white; background-color: #0284c7; padding: 2px 4px; border-radius: 2px;',
    name,
    data,
  )

  if (!isProd) return
  seline.track(name, data)
}

const track = useDebounceFn(undebouncedTrack, 1000)

export function useSeline() {
  return {
    init: initSeline,
    track: (name: string, data?: Record<string, unknown> | null) =>
      track(name, data).then(),
  }
}
