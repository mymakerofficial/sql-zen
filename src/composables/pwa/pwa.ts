import { registerSW } from 'virtual:pwa-register'
import { toast } from 'vue-sonner'

function log(...args: any[]) {
  console.log(
    '%cservice worker',
    'color: white; background-color: #9333ea; padding: 2px 4px; border-radius: 2px;',
    ...args,
  )
}

function init() {
  const updateSW = registerSW({
    onNeedRefresh() {
      toast('Update available! Reload?', {
        action: {
          label: 'Reload',
          onClick: () => updateSW(true),
        },
        cancel: {
          label: 'Ask Later',
        },
        duration: Infinity,
      })
    },
    onOfflineReady() {
      toast('App is ready for offline use!')
    },
    onRegisteredSW(swScriptUrl, registration) {
      log('registered', swScriptUrl, registration)
    },
    onRegisterError(error) {
      log('error', error)
    },
  })
}

export function usePwa() {
  return { init }
}
